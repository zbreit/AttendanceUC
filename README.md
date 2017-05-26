# AttendanceUC
Welcome to AttendanceUC, a barcode attendance system for HackUC II using AirTable, PyBarcode, and Python3. Though we designed it specifically for our event, it is generally applicable to any event.

# How to Use AttendanceUC
Here are some general steps for setting up AttendanceUC for your event.

## Setting up your AirTable
Go to this [page](https://airtable.com/account) on AirTable to generate an API key.

## Installing Dependencies
Here are the packages you need to install to set up:
```
$ pip3 install PyBarcode Pillow
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
