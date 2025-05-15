import socket
import cv2
import pickle
import struct


HOST = '0.0.0.0'  
PORT = 9999

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((HOST, PORT))
server_socket.listen(5)
print("Waiting for connection...")

conn, addr = server_socket.accept()
print(f"Connected to {addr}")


cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

  
    data = pickle.dumps(frame)
    message_size = struct.pack("Q", len(data))  

    try:
        conn.sendall(message_size + data)  
    except:
        break

cap.release()
conn.close()
server_socket.close()