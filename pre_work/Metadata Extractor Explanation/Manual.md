# Metadata Extractor Usage Guide

## Introduction

This document is designed to explain the usage of the Metadata Extractor. The current user interface is a console application, and the results are returned in JSON format. The `Program.cs` will read the JSON data and then write it to the `metadata.txt` file in the format "Type-Value".

Please note that this application is currently not open to users. It serves as a developer testing tool. Once all functionality tests are passed, it will be linked with a frontend web component, allowing users to access it through a web page.

## How to Use

The program offers two output options: full metadata and specified metadata.

1. **Full Metadata**: 
    - When the console prompts you, enter `yes` if you wish to print all metadata.
   
    ![Print Full Metadata 1](https://github.com/tonypioneer/Trust-Indicator/blob/main/docs/Metadata%20Extractor%20Explanation/8862ee6d9291fc3de9fd1a3f7e49ae9.png)
    ![Print Full Metadata 2](https://github.com/tonypioneer/Trust-Indicator/blob/main/docs/Metadata%20Extractor%20Explanation/8445950ae2ec566c69d9fa2a1262ac9.png)

2. **Specified Metadata**:
    - If you choose `no` at the first prompt, the program will ask you to provide the name of the specific metadata type.
    - The program will then search for that value in the metadata list and print the corresponding metadata.
   
    ![Print Partial Metadata 1](https://github.com/tonypioneer/Trust-Indicator/blob/main/docs/Metadata%20Extractor%20Explanation/eae8e6266df5743ecb11132ed8297c0.png)
   
    ![Print Partial Metadata 2](https://github.com/tonypioneer/Trust-Indicator/blob/main/docs/Metadata%20Extractor%20Explanation/2850fbe5c3bd88924915808884af12b.png)

4. **Wrapper Testing Results**:
   
   ![Testing Result](https://github.com/tonypioneer/Trust-Indicator/blob/main/docs/Metadata%20Extractor%20Explanation/1.png)
   
Thank you for using the Metadata Extractor!
