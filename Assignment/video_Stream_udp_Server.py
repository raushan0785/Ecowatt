import cv2
import socket
import pickle
import struct


SERVER_IP = '127.0.0.1'  
PORT = 9999

client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  
client_socket.settimeout(5)


client_socket.sendto(b"Hello", (SERVER_IP, PORT))

data_buffer = b""

while True:
    try:
       
        packet, _ = client_socket.recvfrom(8)
        frame_size = struct.unpack("Q", packet)[0]

      
        while len(data_buffer) < frame_size:
            packet, _ = client_socket.recvfrom(4096)
            data_buffer += packet

        frame_data = data_buffer[:frame_size]
        data_buffer = data_buffer[frame_size:]

        frame = pickle.loads(frame_data)  
        cv2.imshow("UDP Video Stream", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    except socket.timeout:
        print("Server not responding.")
        break

client_socket.close()
cv2.destroyAllWindows()
