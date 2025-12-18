# uploads/parsers.py

from rest_framework.parsers import FileUploadParser, MultiPartParser, FormParser

# Handles raw file uploads (just a single file in the request body)
class CustomFileUploadParser(FileUploadParser):
    """
    Parser for raw file uploads.
    Expects the file to be sent in the body of the request.
    """
    media_type = '*/*'

# Handles multipart/form-data uploads (most common for forms with files)
class CustomMultiPartParser(MultiPartParser):
    """
    Parser for form-data file uploads.
    Can handle multiple files in the same request.
    """
    pass

# Handles standard HTML form submissions
class CustomFormParser(FormParser):
    """
    Parser for standard form-encoded data.
    Useful if some fields are not files.
    """
    pass
