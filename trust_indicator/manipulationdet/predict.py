#240426coding
# Setup Guide:
# 1. Load the whole project to VS Code
# 2. Open terminal, type "pip install -r requirements.txt"
# 3. Open predict.py and change the path in last line to the location of the image you want to analyze

import os
import torch
from PIL import Image
from torch.utils.data import DataLoader
from torchvision import transforms
from tqdm import tqdm

from data.dataset import CASIADataset, NISTDataset, COVERAGEDataset, ColumbiaDataset, IMDDataset, DEFACTODataset
from data.transforms import get_transforms
from model.upernet import UperNet
from utils.utils import AverageMeter, calculate_metric_score
import numpy as np
import cv2


def TTA(model_, img):
    outputs = model_(img)
    outputs += model_(img.flip(dims=(2,))).flip(dims=(2,))

    outputs /= 2

    return outputs


def ensamble(models, img, weights=None):
    if weights is None:
        weights = [1.0 / len(models) for i in range(len(models))]
    # outputs = weights[0] * (activation(models[0](img)) if activation is not None else models[0](img))
    outputs = weights[0] * (models[0](img) if not is_tta else TTA(models[0], img))
    for i in range(1, len(models)):
        # outputs += weights[i] * (activation(models[i](img)) if activation is not None else models[i](img))
        outputs += weights[i] * (models[i](img) if not is_tta else TTA(models[i], img))
    # outputs /= len(models)

    return outputs


def predict(data_set, model, is_tta=False):
    img_paths = test_data.img_paths
    valildation_loader = DataLoader(dataset=data_set,
                                    batch_size=val_batch_size,
                                    shuffle=False,
                                    num_workers=num_workers)
    val_process = tqdm(valildation_loader)
    aucs = AverageMeter()
    f1s = AverageMeter()
    ious = AverageMeter()
    for i, (inputs, targets) in enumerate(val_process):
        # ori_size = inputs.shape
        # if 256 not in ori_size:
        #     continue
        inputs = inputs.type(torch.FloatTensor)
        inputs = inputs.cuda()
        # feature = feature.type(torch.FloatTensor)
        # feature = feature.cuda(device_id)
        with torch.no_grad():
            if not is_ensemble:
                    outputs = model(inputs) if not is_tta else TTA(model, inputs)
                    # res1, outputs, clf = model(inputs) if not is_tta else TTA(model, inputs)

            else:
                outputs = ensamble(model, inputs)
            outputs = outputs.data.cpu().numpy()[:, 0, :, :]

            auc, f1, iou = calculate_metric_score(outputs, targets.data.cpu().numpy(), metric_name=None)
            aucs.update(auc, inputs.size(0))
            f1s.update(f1, inputs.size(0))
            ious.update(iou, inputs.size(0))
            # outputs = outputs*255
            outputs = np.array(outputs > 0.5, dtype=int)
            outputs[outputs == 0] = 0
            outputs[outputs == 1] = 255
            # print(i, outputs.shape, np.unique(outputs), np.sum(outputs == 0), np.sum(outputs == 255))
            img_name = img_paths[i].split('/')[-1].split('.')[0] + '.png'
            mask_name = img_paths[i].split('/')[-1].split('.')[0] + '_gt.png'
            save_path = os.path.join(save_root_path, img_name)
            gt_path = os.path.join(save_root_path, mask_name)
            cv2.imwrite(save_path, outputs[0])
            cv2.imwrite(gt_path, np.array(targets[0][0]*255))
            # cv2.imwrite(save_path, cv2.resize(outputs[0].astype('uint8'), (int(shape[1]), int(shape[0]))))
            val_process.set_description('F1: {:.4f} | AUC: {:.4f} | IoU: {:.4f}'.format(f1s.avg, aucs.avg, ious.avg))


def predict_img(model, img_path):
    test_transforms = transforms.Compose([
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    imageori = cv2.imread(img_path)
    # Revert from BGR
    h, w, _ = imageori.shape
    image = cv2.cvtColor(imageori, cv2.COLOR_BGR2RGB)
    imagesave = cv2.cvtColor(imageori, cv2.COLOR_BGR2RGB)
    image = test_transforms(Image.fromarray(image))
    image = torch.unsqueeze(image, 0)
    inputs = image.type(torch.FloatTensor)
    inputs = inputs.cpu()
    outputs = model(inputs)

    #Calculate the maximal confidence (confidence of green area)
    confidence = torch.sigmoid(outputs)
    max_value = torch.max(confidence)
    cfmax = max_value.item()
    print('Maximal confidence：')
    print(cfmax)    

    
    average_confidence = torch.mean(confidence)
    cfmean = average_confidence.item()
    print('Average confidence：')
    print(cfmean)
    #Calculate the overall confidence

    outputs = outputs.data.cpu().numpy()[:, 0, :, :]

    outputs = np.array(outputs > 0.5, dtype=np.uint8)
    outputs = cv2.resize(outputs[0], (w, h))
    outputs[outputs == 0] = 0
    outputs[outputs == 1] = 255

    save_path = os.path.join(save_root_path, img_path.split('/')[-1].split('.')[0] + '.png')
    cv2.imwrite(save_path, outputs)
    imagewb = cv2.imread(save_path)

    for y in range(h):
        for x in range(w):
            if outputs[y, x] == 255:
                imagesave[y, x] = (0, 255, 0)
    save_path = os.path.join(save_root_path, img_path.split('/')[-1].split('.')[0] +'_r' + '.png')
    cv2.imwrite(save_path, imagesave)
    imagesave = cv2.cvtColor(imagesave, cv2.COLOR_RGB2BGR)
     
    
    h_concat = cv2.hconcat([imageori, imagesave, imagewb])
 
    
    cv2.namedWindow('Horizontal Concatenation', cv2.WINDOW_FREERATIO)
    cv2.imshow('Horizontal Concatenation', h_concat)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


if __name__ == '__main__':
    is_tta = False
    use_au = False
    is_resize = False
    use_crop = True
    crop_shape = [224, 224]
    val_batch_size = 1
    num_workers = 4
    data_name = 'CASIA'

    is_ensemble = False
    if not is_ensemble:
        save_root_path = './'
        if not os.path.isdir(save_root_path):
            os.makedirs(save_root_path)
        model = UperNet(backbone='convnext_base_22k', num_classes=1, in_channels=3, use_edge=False,
                        pretrained=True)
        model_path = './manipulationdet.pth'

        if model_path is not None:
            print('Model found in {}'.format(model_path))
            model.load_state_dict(torch.load(model_path, map_location='cpu')['state_dict'])
        else:
            print('No model found, initializing random model.')
        model = model.cpu()
        model.use_edge = False
        model.eval()

        predict_img(model=model, img_path='Sp_D_CRN_A_nat0093_art0037_0388.jpg')