import barcode  # For generating barcodes given a string of numbers
from barcode.writer import ImageWriter  # For saving files as pngss
import random   # For generating random sequences for barcodes
import json     # For reading the config file

# Get configuration from config.json
configFile = open('config.json')
userConfigs = json.load(configFile)

# Barcode iterator keeps track of the current barcode ID
barcodeIterator = 10000


def createBarcode(participant):
    """Given a dictionary of participant info, generate a barcode using PyBarcode"""
    barcodeNum = getBarcodeNumber(participant)
    return barcode.get('ean8', barcodeNum, writer=ImageWriter())


def getBarcodeNumber(participant):
    """Returns a unicode string that is based on the particapant's submitted information"""
    roleID = getBarcodePrefix(participant['fields']['Role'])
    global barcodeIterator
    randNum = str(barcodeIterator)
    barcodeIterator += 1
    # Concatenate the roleID str and the randNum str
    return roleID + randNum


def getBarcodePrefix(role):
    """Given a participant's role, return their role's prefix"""
    try:
        return userConfigs['roles'][role]
    except KeyError:
        # If there is no valid role, assign an id of 404
        print('Unknown role of "' + role + '"')
        return "404"
