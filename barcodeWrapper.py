import barcode  # For generating barcodes given a string of numbers
import random   # For generating random sequences for barcodes
import json     # For reading the config file

# Get configuration from config.json
configFile = open('config.json')
userConfigs = json.load(configFile)

# Barcode iterator keeps track of the current barcode ID
barcodeIterator = 10000


def createBarcode(participant):
    """Given a dictionary participant info, generate a barcode using PyBarcode """
    barcodeNum = getBarcodeNumber(participant)
    return barcode.get('ean8', barcodeNum)


def getBarcodeNumber(participant):
    """Returns a unicode string that uses the particapant's information to generate a random string."""
    roleID = getBarcodePrefix(participant['fields']['Role'])
    global barcodeIterator
    randNum = str(barcodeIterator)
    barcodeIterator += 1
    # Perform add the roleID str and the randNum str
    return roleID + randNum


def getBarcodePrefix(role):
    """Given a participant's role, return their role's prefix"""
    try:
        return userConfigs['roles'][role]
    except KeyError:
        # If there is no valid role, assign an id of 404
        print('Unknown role of "' + role + '"')
        return "404"
