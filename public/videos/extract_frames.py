import cv2, os
video = os.path.abspath('public/videos/ice-rose-reference.mp4')
out = os.path.abspath('public/videos/frames')
os.makedirs(out, exist_ok=True)
cap = cv2.VideoCapture(video)
total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print('total', total)
for i, p in enumerate([0.08, 0.22, 0.38, 0.54, 0.70, 0.86], 1):
    cap.set(cv2.CAP_PROP_POS_FRAMES, min(total - 1, int(total * p)))
    ok, frame = cap.read()
    if ok:
        ok2, buf = cv2.imencode('.jpg', frame)
        path = os.path.join(out, f'ice-rose-frame-{i:02d}.jpg')
        if ok2:
            with open(path, 'wb') as f:
                f.write(buf.tobytes())
            print(path, os.path.getsize(path))
cap.release()
