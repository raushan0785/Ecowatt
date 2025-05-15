import socket
import cv2
import pickle
import struct


HOST = '127.0.0.1'  
PORT = 9999

client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect((HOST, PORT))

data_buffer = b""

while True:
    while len(data_buffer) < struct.calcsize("Q"):
        packet = client_socket.recv(4096)
        if not packet:
            break
        data_buffer += packet

    packed_msg_size = data_buffer[:struct.calcsize("Q")]
    data_buffer = data_buffer[struct.calcsize("Q"):]
    
    msg_size = struct.unpack("Q", packed_msg_size)[0]

    while len(data_buffer) < msg_size:
        packet = client_socket.recv(4096)
        if not packet:
            break
        data_buffer += packet

    frame_data = data_buffer[:msg_size]
    data_buffer = data_buffer[msg_size:]

    frame = pickle.loads(frame_data)  
    cv2.imshow("Video Stream", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

client_socket.close()
cv2.destroyAllWindows()