'use client';

import { FormInstance } from 'antd/lib/form';
import {
  Button,
  Card,
  Row,
  Col,
  Divider,
  DatePicker,
  Select,
  InputNumber,
  Popconfirm,
  message,
  Form,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { peminjamanRepository } from '#/repository/peminjaman';
import { barangRepository } from '#/repository/barang';
import { koleksiRepository } from '#/repository/koleksi';
import { parseJwt } from '#/utils/parseJwt';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { config } from '#/config/app';
import { imgUrl } from '../barang/page';
// export const imgUrl = (photo: string) => `${config.baseUrl}/upload/get-barang/${photo}`;

const { RangePicker } = DatePicker;
const { Option } = Select;

interface KoleksiItem {
  koleksiId: string; // ID koleksi
  ruanganBarangId: string; // ID ruangan barang
  jumlah: number; // Jumlah barang
}

interface createPeminjaman {
  akunId: string; // ID akun peminjam
  tanggalPinjam: string; // Tanggal peminjaman
  tanggalPengembalian: string; // Tanggal pengembalian
  koleksi: KoleksiItem[]; // Array item koleksi
}

const Detailpeminjaman = ({ params }: { params: { id: string } }) => {
  const [borrowDate, setBorrowDate] = useState<Date | null>(() => null);
  const [returnDate, setReturnDate] = useState<Date | null>(() => null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  // const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [returnedDate, setReturnedDate] = useState<Date | null>(() => null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { data: koleksi } = koleksiRepository.hooks.useGetkoleksi();
  console.log(koleksi, 'koleksi');
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('Pending');
  const [createPeminjaman, setcreatePeminjaman] = useState<createPeminjaman>({
    akunId: '',
    tanggalPinjam: '',
    tanggalPengembalian: '',
    koleksi: [],
  });

  const handleButtonClick = (status: string) => {
    console.log('Button clicked for phone number:', status);
  };
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '700';
  const [value, setValue] = useState(1);

  const handleChange = (newValue: any) => {
    if (newValue >= 1) {
      setValue(newValue);
    }
  };
  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleDateChange = (
    date: any,
    dateString: string,
    field: 'tanggalPinjam' | 'tanggalPengembalian'
  ) => {
    setcreatePeminjaman((prevState) => ({
      ...prevState,
      [field]: dateString,
    }));
  };

  useEffect(() => {
    // Mendapatkan access_token dari localStorage
    const token = localStorage.getItem('access_token');

    if (token) {
      try {
        // Parsing token untuk mendapatkan akunId
        const parseToken = parseJwt(token);
        console.log('Hasil parsing token:', parseToken); // Log seluruh hasil parsing

        if (parseToken && parseToken.existUser && parseToken.existUser.id) {
          console.log('Akun ID dari token:', parseToken.existUser.id); // Log akunId yang ditemukan
          setcreatePeminjaman((prevState) => ({
            ...prevState,
            akunId: parseToken.existUser.id, // Ambil id dari existUser di dalam token
          }));
        } else {
          console.error('Token tidak memiliki ID akun:', parseToken);
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    } else {
      console.error('Tidak ada token ditemukan di localStorage');
    }
  }, []);

  const onFinishPinjam = async (values: any) => {
    console.log('data values: ', values);
    try {
      setLoading(true);
      setError(null);

      // Menyusun data yang akan dikirim
      const koleksiData = dataSource.map((item) => ({
        koleksiId: item.id, // Menggunakan id sebagai koleksiId
        ruanganBarangId: item.ruanganBarang.id, // Menggunakan ruanganBarang.id
        jumlah: item.jumlah,
      }));

      // Pastikan kita mendapatkan akunId dari salah satu item koleksi
      const akunId = dataSource.length > 0 ? dataSource[0].akun.id : createPeminjaman.akunId;

      const data = {
        akunId: akunId,
        tanggalPinjam: createPeminjaman.tanggalPinjam,
        tanggalPengembalian: createPeminjaman.tanggalPengembalian,
        koleksi: koleksiData,
      };
      router.push('/peminjaman');
      const request = await peminjamanRepository.api.peminjaman(data);
      if (request.status === 400) {
        setError(request.body.message);
      } else {
        message.success('Berhasil membuat peminjaman!');
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Gagal membuat peminjaman!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await koleksiRepository.api.deletekoleksi(id); // Panggil API untuk menghapus akun berdasarkan ID
      const newData = dataSource.filter((item) => item.id !== id);
      console.log(newData, 'delete');
      message.success('Akun Berhasil Dihapus!');
      setDataSource(newData);
    } catch (error) {
      console.error('Akun Gagal Dihapus:', error);
    }
  };

  const [dataSource, setDataSource] = useState([]);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Ensure localStorage is accessed only in the browser
    if (typeof window !== 'undefined') {
      // Retrieve token from localStorage
      const token = localStorage.getItem('access_token');
      const parsedToken = parseJwt(token);
      // Extract userId from parsedToken
      setUserId(parsedToken.existUser?.id);
    }
  }, []);

  useEffect(() => {
    if (koleksi != null && userId) {
      // Filter by akunId using userId
      const filteredData = koleksi.koleksi.filter((item) => item.akun.id === userId);
      console.log(filteredData, 'filteredData');

      setDataSource(filteredData);
    }
  }, [koleksi, userId]);

  return (
    <div style={{ marginLeft: '50px' }}>
      <title>Koleksi</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '20px' }}>Koleksi</h1>
      <div>
        <Row>
          <Col>
            {/* Kolom Kiri dengan 3 Kartu */}
            {dataSource.map((item, index) => (
              <Card
                key={item.id}
                className="shadow-card"
                style={{
                  width: '650px',
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px',
                  borderRadius: '20px',
                  marginTop: '40px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      backgroundColor: 'rgba(128, 128, 128, 0.5)',
                      padding: '10px',
                      borderRadius: '20px',
                    }}
                  >
                    <img
                      src={imgUrl(item.ruanganBarang.barang.gambar)}
                      style={{ width: '100px', marginRight: '10px', marginLeft: '10px' }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginLeft: '20px',
                        marginBottom: '10px',
                      }}
                    >
                      {item.ruanganBarang.barang.nama}
                    </div>
                    <div style={{ fontSize: '17px', marginBottom: '15px', marginLeft: '20px' }}>
                      <span style={{ color: 'grey' }}>
                        {item.ruanganBarang.ruangan.Letak_Barang}
                      </span>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <InputNumber
                        min={1}
                        disabled
                        value={item.jumlah}
                        onChange={(value) => handleChange(value)}
                        controls={false}
                        style={{
                          marginLeft: '20px',
                          width: '60px',
                          boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </div>
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                      <Popconfirm
                        title="Menghapus koleksi"
                        description="Apakah Anda yakin ingin menghapus barang ini?"
                        onConfirm={() => handleDelete(item.id)}
                        okButtonProps={{ loading: confirmLoading }}
                        onCancel={handleCancel}
                        okText="Iya"
                        cancelText="Tidak"
                      >
                        <Button
                          type="link"
                          icon={
                            <img
                              src="/koleksiDelete.svg"
                              style={{ width: '19px', height: '19px' }}
                            />
                          }
                        >
                          <span style={{ color: 'black' }}>Hapus</span>
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </Col>
          <Col style={{ marginLeft: '50px' }}>
            {/* Kolom Kanan dengan 2 Kartu */}
            <Card
              className="shadow-card"
              style={{
                width: '500px',
                height: '300px',
                display: 'flex',
                marginBottom: '10px',
                borderRadius: '20px',
                padding: '20px',
                marginTop: '40px',
              }}
            >
              <Form onFinish={onFinishPinjam} layout="horizontal" style={{ textAlign: 'center' }}>
                <div>
                  <p
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginTop: '-20px',
                      marginBottom: '20px',
                    }}
                  >
                    <span>Masukkan Tanggal</span>
                  </p>
                </div>
                <Form.Item
                  label="Tanggal Peminjaman"
                  name="tanggalPinjam"
                  rules={[{ required: true, message: 'Tanggal Peminjaman diperlukan' }]}
                  style={{ marginBottom: '20px', marginTop: '40px' }}
                >
                  <DatePicker
                    placeholder="Tanggal Pinjam"
                    style={{ width: '25vh', height: '40px', marginLeft: '13px' }}
                    value={
                      createPeminjaman.tanggalPinjam
                        ? dayjs(createPeminjaman.tanggalPinjam, 'YYYY-MM-DD')
                        : null
                    }
                    onChange={(date, dateString) =>
                      handleDateChange(date, dateString, 'tanggalPinjam')
                    }
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
                <Form.Item
                  label="Tanggal Pengembalian"
                  name="tanggalPengembalian"
                  rules={[{ required: true, message: 'Tanggal Pengembalian diperlukan' }]}
                >
                  <DatePicker
                    placeholder="Tanggal Pengembalian"
                    style={{ width: '25vh', height: '40px' }}
                    value={
                      createPeminjaman.tanggalPengembalian
                        ? dayjs(createPeminjaman.tanggalPengembalian, 'YYYY-MM-DD')
                        : null
                    }
                    onChange={(date, dateString) =>
                      handleDateChange(date, dateString, 'tanggalPengembalian')
                    }
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
                {/* <Form.Item
                  label="Jumlah"
                  name="jumlah"
                  rules={[{ required: true, message: 'Jumlah diperlukan' }]}
                >
                  <InputNumber
                    min={1}
                    value={createPeminjaman.jumlah}
                    onChange={(value) =>
                      setcreatePeminjaman((prev) => ({ ...prev, jumlah: value || 0 }))
                    }
                    style={{ width: '100%', boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)' }}
                  />
                </Form.Item> */}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      width: '20vh',
                      height: '45px',
                      backgroundColor: '#582DD2',
                      color: 'white',
                      marginTop: '10px',
                      marginLeft: '10px',
                    }}
                  >
                    <p style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Arial' }}>
                      Pinjam
                    </p>
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Detailpeminjaman;
