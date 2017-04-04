import barcode    # For creating barcode's based on registration info
import requests   # For interfacing with the registration info on AirTable
import os         # For accessing the API key environment variable

airTableKey = os.environ['AIRTABLE_API_KEY']
