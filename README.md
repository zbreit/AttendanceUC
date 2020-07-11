# AttendanceUC

<p align="center"><img src="./demo.gif" alt="Product Demo"></p>

Welcome to AttendanceUC, a barcode attendance system for HackUC II using AirTable, PyBarcode, and Python3. Though we designed it specifically for our event, it is generally applicable to any event.

## How to Use the Barcode Generator

Here are some general steps for setting up the Barcode Generator for your event.

### Setting up your API Keys

Go to this [page](https://airtable.com/account) on AirTable and this [page](https://dev.filestack.com/apps/) on Filestack to generate your API keys.

### Installing Dependencies

Here are the python packages you need to install to set up:

```bash
pip3 install PyBarcode Pillow requests
```

### Setting Up your Environment

To set up your API key, you have to modify the `barcodeGenerator/airtableSecret.json` file:

```json
{
    "AIRTABLE_KEY": "INSERT_API_KEY_HERE",
    "AIRTABLE_URL": "INSERT_URL_HERE"
}
```

## Running the program

Once you've setup your config.json file in the barcodeGenerator directory to match your desired roles and prefixes, run the following command to generate barcodes for your participants.

```bash
python3 barcodeGenerator.py
```
