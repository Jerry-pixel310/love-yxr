import cv2, os
video = os.path.abspath('public/videos/ice-rose-reference.mp4')
out = os.path.abspath('public/images')
os.makedirs(out, exist_ok=True)
cap = cv2.VideoCapture(video)
total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
frame_index = min(total - 1, int(total * 0.54))
cap.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
ok, frame = cap.read()
cap.release()
if not ok:
    raise SystemExit('failed to read frame')
# Crop the central video artwork area while keeping code background and ice stage.
h, w = frame.shape[:2]
# Slight contrast/color enhancement for web display.
lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
l, a, b = cv2.split(lab)
clahe = cv2.createCLAHE(clipLimit=1.6, tileGridSize=(8,8))
l = clahe.apply(l)
frame = cv2.cvtColor(cv2.merge([l,a,b]), cv2.COLOR_LAB2BGR)
frame = cv2.convertScaleAbs(frame, alpha=1.05, beta=2)
ok2, buf = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
path = os.path.join(out, 'ice-rose-reference-frame.jpg')
if ok2:
    with open(path, 'wb') as f:
        f.write(buf.tobytes())
print(path, os.path.getsize(path))
