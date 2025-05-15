import cv2
import socket
import pickle
import struct


HOST = '0.0.0.0'  
PORT = 9999

server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

print("UDP Video Streaming Server Started...")
client_address = None  


cap = cv2.VideoCapture(0)  

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    data = pickle.dumps(frame)  
    packet_size = struct.pack("Q", len(data))  

    if client_address:  
        server_socket.sendto(packet_size, client_address)
        server_socket.sendto(data, client_address)

    else:  
        print("Waiting for client...")
        message, client_address = server_socket.recvfrom(1024)  
        print(f"Client connected: {client_address}")

cap.release()
server_socket.close()
