def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = [message for key, value in validation_errors.items() for message in value]
    
    return errorMessages