import cv2
def preprocess_image(input_path, output_path):
    image = cv2.imread(input_path)

    if image is None:
        raise ValueError("Could not read the image")

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Improve contrast using CLAHE
    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8)
    )

    enhanced = clahe.apply(gray)

    # Sharpen the handwriting
    sharpened = cv2.addWeighted(
        enhanced, 1.5,
        cv2.GaussianBlur(enhanced, (0, 0), 3), -0.5,
        0
    )

    # Save processed image
    cv2.imwrite(output_path, sharpened)

    return output_path









# import cv2


# def preprocess_image(input_path, output_path):
#     # Read the original image
#     image = cv2.imread(input_path)

#     if image is None:
#         raise ValueError(f"Could not read image: {input_path}")

#     # 1. Resize small images to help OCR read text.
#     height, width = image.shape[:2]

#     target_width = 1600

#     if width < target_width:
#         scale = target_width / width
#         new_width = target_width
#         new_height = int(height * scale)

#         image = cv2.resize(
#             image,
#             (new_width, new_height),
#             interpolation=cv2.INTER_CUBIC,
#         )

#     # 2. Convert to grayscale.
#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

#     # 3. Reduce noise while preserving edges.
#     denoised = cv2.fastNlMeansDenoising(
#         gray,
#         None,
#         h=5,
#         templateWindowSize=7,
#         searchWindowSize=21,
#     )

#     # 4. Improve local contrast.
#     clahe = cv2.createCLAHE(
#         clipLimit=2.0,
#         tileGridSize=(8, 8),
#     )
#     enhanced = clahe.apply(denoised)

#     # 5. Apply gentle sharpening.
#     blurred = cv2.GaussianBlur(
#         enhanced,
#         (0, 0),
#         sigmaX=1.0,
#     )

#     sharpened = cv2.addWeighted(
#         enhanced,
#         1.2,
#         blurred,
#         -0.2,
#         0,
#     )

#     # 6. Save the processed image.
#     success = cv2.imwrite(output_path, sharpened)

#     if not success:
#         raise ValueError(f"Could not save processed image: {output_path}")

#     return output_path
