import { networkInterfaces } from 'os';

const wlan = networkInterfaces()['wlp0s20f0u5'];
const virt = networkInterfaces()['eth0:0'];

// s3 client config
export const endpoint = `http://${wlan ? wlan[0].address : virt[0].address}:9000`;
export const bucketName = 'test-image-upload-s3';
export const accessKeyId = 'u4is3su0YU93UbVnPgrf';
export const secretAccessKey = 'OWBdolwhoo2Jf036uLXSYBAGWZn4h2zxhilBdVmW';