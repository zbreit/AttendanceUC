# AttendanceUC
Welcome to AttendanceUC, a barcode attendance system for HackUC II using AirTable, PyBarcode, and Python3. Though we designed it specifically for our event, it is generally applicable to any event.

# How to Use the Barcode Generator
Here are some general steps for setting up the Barcode Generator for your event.

## Setting up your API Keys
Go to this [page](https://airtable.com/account) on AirTable and this [page](https://dev.filestack.com/apps/) on Filestack to generate your API keys.


## Installing Dependencies
Here are the python packages you need to install to set up:
```
$ pip3 install PyBarcode Pillow requests
```

## Setting Up your Environment
To set up your API key, you have to declare it as an environment variable. The easiest way to do this is by running the following commands, which are OS dependent:

#### Mac
```
$ echo "export AIRTABLE_API_KEY=\"<insert your AIRTABLE API KEY here>\"\nexport AIRTABLE_URL=\"<insert your airtable url>\"\nexport FILESTACK_API_KEY=\"<insert your FILESTACK API KEY here>\"" >> ~/.bash_profile
$ source ~/.bash_profile
```

#### Linux
```
$ echo "export AIRTABLE_API_KEY=\"<insert your AIRTABLE API KEY here>\"\nexport AIRTABLE_URL=\"<insert your airtable url>\"\nexport FILESTACK_API_KEY=\"<insert your FILESTACK API KEY here>\"" >> ~/.bash_rc
$ source ~/.bash_rc
```

#### Windows
Good luck with Windows

## Running the program
Once you've setup your config.json file in the barcodeGenerator directory to match your desired roles and prefixes, run the following command to generate barcodes for your participants.

```
$ python3 barcodeGenerator.py
```
