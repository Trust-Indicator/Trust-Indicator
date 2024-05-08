#!/usr/bin/env python3
"""PyTorch Inference Script

An example inference script that outputs top-k class ids for images in a folder into a csv.

Hacked together by / Copyright 2020 Ross Wightman (https://github.com/rwightman)
"""

import argparse
import logging
import torch
from PIL import Image
from torchvision import transforms

from timm.models import create_model
from timm.data import resolve_data_config
from timm.utils import setup_default_logging

torch.backends.cudnn.benchmark = True
_logger = logging.getLogger('inference')


parser = argparse.ArgumentParser(description='PyTorch ImageNet Inference')
parser.add_argument('--image-path', metavar='',
                    help='path to image')
parser.add_argument('--model', '-m', metavar='MODEL', default='resnet18',
                    help='model architecture (default: resnet18)')
parser.add_argument('-j', '--workers', default=2, type=int, metavar='N',
                    help='number of data loading workers (default: 2)')
parser.add_argument('--img-size', default=None, type=int,
                    metavar='N', help='Input image dimension')
parser.add_argument('--input-size', default=None, nargs=3, type=int,
                    metavar='N N N', help='Input all image dimensions (d h w, e.g. --input-size 3 224 224), uses model default if empty')
parser.add_argument('--mean', type=float, nargs='+', default=None, metavar='MEAN',
                    help='Override mean pixel value of dataset')
parser.add_argument('--std', type=float, nargs='+', default=None, metavar='STD',
                    help='Override std deviation of of dataset')
parser.add_argument('--interpolation', default='', type=str, metavar='NAME',
                    help='Image resize interpolation type (overrides model)')
parser.add_argument('--num-classes', type=int, default=2,
                    help='Number classes in dataset')
parser.add_argument('--log-freq', default=10, type=int,
                    metavar='N', help='batch logging frequency (default: 10)')
parser.add_argument('--checkpoint', default='./trust_indicator/aigc_det/weight/resnet18_distll.pth.tar', type=str, metavar='PATH',
                    help='path to latest checkpoint (default: none)')
parser.add_argument('--pretrained', dest='pretrained', action='store_true',
                    help='use pre-trained model')
parser.add_argument('--num-gpu', type=int, default=1,
                    help='Number of GPUS to use')
parser.add_argument('--no-test-pool', dest='no_test_pool', action='store_true',
                    help='disable test time pool')

    
def main():
    setup_default_logging()
    args = parser.parse_args()
    # might as well try to do something useful...
    args.pretrained = args.pretrained or not args.checkpoint

    # create model
    model = create_model(
        args.model,
        num_classes=args.num_classes,
        in_chans=3,
        pretrained=args.pretrained,
        checkpoint_path=args.checkpoint)

    _logger.info('Model %s created, param count: %d' %
                 (args.model, sum([m.numel() for m in model.parameters()])))

    config = resolve_data_config({}, model=model)
    
    # Load and transform the image
    image = Image.open(args.image_path)
    image_rgb = image.convert('RGB')
    transform = transforms.Compose([
        transforms.Resize(config['input_size'][1:]),
        transforms.ToTensor(),
        transforms.Normalize(mean=config['mean'], std=config['std'])
    ])
    input_tensor = transform(image_rgb).unsqueeze(0)  # Create a mini-batch as expected by the model

    # Use GPU if available
    # device = torch.device('cuda' if args.num_gpu > 0 and torch.cuda.is_available() else 'cpu')
    device = 'cpu'
    model = model.to(device)
    input_tensor = input_tensor.to(device)

    # Set model to evaluate mode
    model.eval()

    with torch.no_grad():
        # Forward pass: compute predicted outputs by passing inputs to the model
        _, _, _, _, _, output = model(input_tensor)

        probabilities = torch.nn.functional.softmax(output, dim=1)

    # Output the probabilities
    probabilities = probabilities.cpu().numpy().flatten()
    
    _logger.info(f'ai: {probabilities[0]*100:.2f}%, nature: {probabilities[1]*100:.2f}%')


if __name__ == '__main__':
   
    main()
   