'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  Upload,
  message,
  Row,
  Col,
  Card,
  Dropdown,
  Menu,
  Avatar,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import type { InputRef } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Router } from 'react-router-dom';
import { useRouter } from 'next/navigation';
import { petugasRepository } from '#/repository/petugas';
import { log } from 'console';
import { akunRepository } from '#/repository/akun';
import { create } from 'domain';
export enum rolePeran {
  Admin = 'admin',
  Petugas = 'petugas',
  Peminjam = 'peminjam',
}

const { Search } = Input;
const { Item } = Menu;

export enum statusBarang {
  Aktif = 'aktif',
  TidakAktif = 'tidak aktif',
  Pending = 'pending',
  Diterima = 'diterima',
  Ditolak = 'ditolak',
}

// interface deletePetugas {
//   id: string;
// }
interface updatePetugas {
  id: string;
  username: string;
  nomorInduk: string;
  telp: string;
}

interface createAkunpetugas {
  peranId: string;
  nama: string;
  nomorInduk: string;
  telp: string;
  gambar: string;
  username: string;
  password: string;
  status: statusBarang;
  kelas: string;
}

const EditableContext = React.createContext<FormInstance<any> | null>(null);
interface Item {
  id: string;
  name: string;
  username: string;
  telp: string;
  nomorInduk: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
  handleEdit: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  handleEdit,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  // const [deletePetugas, setdeletePetugas] = useState<deletePetugas>({
  //   id: '',
  // });

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  id: React.Key;
  name: string;
  username: string;
  telp: string;
  nomorInduk: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const Page: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const [count, setCount] = useState(0);

  const [nama, setNama] = useState('');
  const [nomorInduk, setnomorInduk] = useState('');
  const [username, setusername] = useState('');
  const [telp, setTelp] = useState('');
  const [namaPengguna, setNamaPengguna] = useState('');
  const [sandi, setSandi] = useState('');
  const [konfirmasiSandi, setKonfirmasiSandi] = useState('');
  const [createAkunpetugas, setcreateAkunpetugas] = useState<createAkunpetugas>({
    peranId: 'c0534779-e544-4325-89a0-6933432c69ec',
    status: statusBarang.Aktif,
    nama: '',
    kelas: '',
    nomorInduk: '',
    telp: '',
    gambar: '',
    username: '',
    password: '',
  });

  // const [deletePetugas, setdeletePetugas] = useState<deletePetugas>({
  //   id: '',
  // });

  const [updatePetugas, setupdatePetugas] = useState<updatePetugas>({
    id: '',
    nomorInduk: '',
    telp: '',
    username: '',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [editData, setEditData] = useState<DataType | null>(null);
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef<HTMLDivElement | null>(null);
  const { data: listakun } = akunRepository.hooks.useAkun();
  console.log(listakun, 'listPetugas');
  const petugasData = listakun?.data?.filter((item: any) => item.peran?.Role === 'petugas');
  const [form] = Form.useForm();
  const [id, setId] = useState<string>('');
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '700';
  const { data: akun, mutate: mutateListPetugas } = akunRepository.hooks.useAuth();
  const role = akun?.data?.peran?.Role;

  const router = useRouter();

  useEffect(() => {
    if (id && modalEditVisible) {
      // Fetch the data for the specific user by id and populate the form
      api.akun(id).then((response: any) => {
        setupdatePetugas(response.data);
      });
    }
  }, [id, modalEditVisible]);

  // menu akun
  const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  // style button search
  useEffect(() => {
    if (searchRef.current) {
      const searchButton = searchRef.current.querySelector('.ant-input-search-button');
      if (searchButton instanceof HTMLElement) {
        // Memastikan searchButton adalah HTMLElement
        searchButton.style.backgroundColor = '#582DD2';
        searchButton.style.borderColor = '#582DD2';
      }
    }
  }, []);

  // menu akun
  const menu = (
    <Menu>
      <Item key="1" onClick={() => logout()}>
        <a style={{ color: 'red' }} target="_blank" rel="noopener noreferrer">
          <ArrowLeftOutlined style={{ color: 'red', marginRight: '10px' }} />
          Keluar
        </a>
      </Item>
    </Menu>
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleButtonClick = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setModalEditVisible(false);
    form.resetFields();
  };

  const onFinish = async (values: any) => {
    console.log('data values: ', values);
    try {
      setLoading(true);
      setError(null);
      const data = {
        peranId: createAkunpetugas.peranId,
        status: createAkunpetugas.status,
        nama: createAkunpetugas.nama,
        nomorInduk: createAkunpetugas.nomorInduk,
        telp: createAkunpetugas.telp,
        gambar: createAkunpetugas.gambar,
        username: createAkunpetugas.username,
        password: createAkunpetugas.password,
        kelas: createAkunpetugas.kelas,
      };
      const request = await akunRepository.api.akun(data);
      if (request.status === 400) {
        setError(request.body.message);
      } else {
        message.success('Berhasil Menambah Petugas!');
        setModalVisible(false);
        await mutateListPetugas();
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Gagal Menambah Petugas!');
      console.log();
    } finally {
      setLoading(false);
    }
  };

  const handleEditPetugas = async (id: string) => {
    // console.log('data values: ', values);
    console.log('data id: ', id);
    try {
      setLoading(true);
      setError(null);
      const data = {
        username: updatePetugas.username,
        nomorInduk: updatePetugas.nomorInduk,
        telp: updatePetugas.telp,
      };
      const request = await akunRepository.api.updateAkun(id, data);
      if (request.status === 400) {
        setError(request.body.message);
      } else {
        message.success('Berhasil Mengedit Petugas!');
        setModalVisible(false);
        await mutateListPetugas();
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('GagalMengedit Petugas!');
      console.log();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await akunRepository.api.deleteAkun(id); // Panggil API untuk menghapus akun berdasarkan ID
      const newData = dataSource.filter((item) => item.id !== id);
            console.log(newData, 'delete');
      message.success('Akun Berhasil Dihapus!');
      setDataSource(newData);
    } catch (error) {
      console.error("Akun Gagal Dihapus:", error);
    }
  };

  const handleEdit = (record: Item) => {
    setId(record.id);
    setEditData(record);
    setNama(record.name);
    setusername(record.username);
    setnomorInduk(record.nomorInduk);
    setTelp(record.telp);
    setModalEditVisible(true);
  };

  useEffect(() => {
    if (listakun) {
      // Filter data untuk hanya menampilkan entitas dengan peran 'Petugas'
      const filteredData = listakun.data.filter((item: Item) =>
        item ? akun?.data?.peran?.Role === rolePeran.Petugas : true
      );
      setDataSource(filteredData);
    }
  }, [listakun]);

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Nama',
      dataIndex: 'nama',
      width: '20%',
      editable: true,
      render: (_, record) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={record.gambar} />
            <span style={{ marginLeft: '10px' }}>{record.nama}</span>
          </div>
        );
      },
    },
    {
      title: 'Nama Pengguna',
      dataIndex: 'username',
      width: '20%',
      editable: true,
    },
    {
      title: 'Telp',
      dataIndex: 'telp',
      width: '20%',
      editable: true,
    },
    {
      title: 'NIP',
      dataIndex: 'NIP',
      width: '20%',
      editable: true,
      render: (_, record) => {
        return record.petugas[0].NIP;
      },
    },
    {
      title: '',
      dataIndex: '',
      render: (record: Item) => {
        return (
            <span>
              <Button
                type="link"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(record);
                }}
                icon={<img src="/logoEdit.svg" style={{ width: '19px', height: '19px' }} />}
              />
              <Popconfirm
                title="Hapus Petugas"
                onConfirm={() => handleDelete(record.id)} // Mengirimkan ID yang benar untuk dihapus
                onCancel={(e) => {
                  if (e) e.stopPropagation(); // Mencegah penyebaran klik saat cancel
                }}
              >
                <Button
                  type="link"
                  onClick={(e) => {
                    if (e) e.stopPropagation(); // Menghentikan penyebaran klik ke baris lain
                  }}
                  icon={<img src="/logoDelete.svg" style={{ width: '20px', height: '20px' }} />}
                />
              </Popconfirm>
            </span>
              );
         },
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleChange = async (args: any) => {
    const file = args.file;

    try {
      const createBarang = { file };
      const processUpload = await akunRepository.api.uploadAkun(file);
      setcreateAkunpetugas((createAkunpetugas: any) => ({
        ...createAkunpetugas,
        gambar: processUpload?.body?.data?.filename,
      }));
      console.log(processUpload, 'create');
      message.success('Gambar Berhasil Di Unggah!');
    } catch (e) {
      console.log(e, 'ini catch e');
      // setTimeout(message.eror("Gambar Gagal Di Unggah"))
    }
  };

  return (
    <div>
      <title>Petugas</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '45px' }}>Petugas</h1>
      <Card style={{ marginTop: '50px', borderRadius: '20px' }}>
        <div ref={searchRef}>
          <Search
            placeholder="Telusuri Barang Masuk"
            className="custom-search"
            allowClear
            enterButton
            onSearch={() => {}}
            style={{ width: 300, marginRight: '950px', height: '40px', marginTop: '10px' }}
          />
        </div>
        <Button
          type="primary"
          onClick={handleButtonClick}
          icon={<PlusOutlined style={{ marginTop: '10px', marginLeft: '20px' }} />}
          style={{
            marginLeft: 'auto',
            display: 'flex',
            bottom: '25px',
            right: '20px',
            width: '200px',
            height: '40px',
            backgroundColor: 'white',
            boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
            color: 'black',
          }}
          className="custom-button"
        >
          <span style={{ marginLeft: '8px', marginTop: '6px' }}>Akun Petugas</span>
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={petugasData}
          pagination={{ pageSize: 5 }}
          columns={columns as ColumnTypes}
          style={{ marginTop: '30px' }}
        />
        {/* CREATE AKUN PETUGAS */}
        <Modal
          title={
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '20px' }}>
              Tambah Akun Petugas
            </div>
          }
          style={{ textAlign: 'center' }}
          centered
          width={1000}
          visible={modalVisible}
          onCancel={handleModalCancel}
          footer={null}
        >
          <Form
            form={form}
            layout="horizontal"
            onFinish={onFinish}
            initialValues={{
              nama: '',
              nip: '',
              telp: '',
              namaPengguna: '',
              sandi: '',
              konfirmasiSandi: '',
            }}
          >
            <Row gutter={[24, 24]} justify="center" style={{ marginTop: '50px' }}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Nama"
                  name="nama"
                  rules={[{ required: true, message: 'Nama harus diisi' }]}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    style={{ width: '100%', height: '45px' }}
                    placeholder="Nama"
                    value={createAkunpetugas.nama}
                    onChange={(e) =>
                      setcreateAkunpetugas({ ...createAkunpetugas, nama: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="NIP"
                  name="nomorInduk"
                  rules={[{ required: true, message: 'NIP harus diisi' }]}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    style={{ width: '100%', height: '45px' }}
                    placeholder="NIP"
                    value={createAkunpetugas.nomorInduk}
                    onChange={(e) =>
                      setcreateAkunpetugas({ ...createAkunpetugas, nomorInduk: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Telp"
                  name="telp"
                  rules={[{ required: true, message: 'Telp harus diisi' }]}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    style={{ width: '100%', height: '45px' }}
                    placeholder="Telp"
                    value={createAkunpetugas.telp}
                    onChange={(e) =>
                      setcreateAkunpetugas({ ...createAkunpetugas, telp: e.target.value })
                    }
                    maxLength={12}
                  />
                </Form.Item>
                <Form.Item
                  label="Unggah Foto"
                  name="foto"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 14 }}
                >
                  <Upload
                    listType="picture"
                    beforeUpload={() => false}
                    onChange={(args) => handleChange(args)}
                  >
                    <Button icon={<UploadOutlined />} style={{ marginRight: '200px' }}>
                      Unggah
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Nama Pengguna"
                  name="username"
                  rules={[{ required: true, message: 'Nama Pengguna harus diisi' }]}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    style={{ width: '100%', height: '45px' }}
                    placeholder="Nama Pengguna"
                    value={createAkunpetugas.username}
                    onChange={(e) =>
                      setcreateAkunpetugas({ ...createAkunpetugas, username: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Sandi"
                  name="password"
                  rules={[{ required: true, message: 'Sandi harus diisi' }]}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input.Password
                    style={{ width: '100%', height: '45px' }}
                    placeholder="Sandi"
                    value={createAkunpetugas.password}
                    onChange={(e) =>
                      setcreateAkunpetugas({ ...createAkunpetugas, password: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Konfirmasi Sandi"
                  name="konfirmasiSandi"
                  rules={[
                    { required: true, message: 'Konfirmasi Sandi harus diisi' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Sandi tidak cocok.'));
                      },
                    }),
                  ]}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input.Password
                    style={{ width: '100%', height: '45px' }}
                    placeholder="Konfirmasi Sandi"
                    onChange={(e) => setKonfirmasiSandi(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ textAlign: 'right', marginTop: '24px', marginRight: '40px' }}>
              <Button
                type="default"
                onClick={handleModalCancel}
                style={{
                  width: '100px',
                  height: '35px',
                  borderColor: 'black',
                  color: 'black',
                  marginRight: '10px',
                }}
              >
                Batal
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: '100px',
                  height: '35px',
                  backgroundColor: '#582DD2',
                  color: 'white',
                  borderColor: '#582DD2',
                }}
              >
                Simpan
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* EDIT AKUN PETUGAS */}
        <Modal
          title={
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px' }}>
              Buat Akun Petugas
            </div>
          }
          style={{ textAlign: 'center' }}
          centered
          width={1000}
          visible={modalVisible}
          onCancel={handleModalCancel}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              nama: '',
              nip: '',
              telp: '',
              username: '',
              sandi: '',
              konfirmasiSandi: '',
            }}
          >
            <div style={{ marginTop: '90px', marginRight: '70px' }}>
              <Row gutter={[24, 24]}>
                <Col push={1} span={10}>
                  <Form.Item
                    label="Nama"
                    name="nama"
                    rules={[{ required: true, message: 'Nama harus di isi' }]}
                    style={{ fontWeight, fontFamily, marginBottom: '-10px' }}
                  >
                    <Input
                      placeholder="Nama"
                      style={{
                        width: '300px',
                        height: '45px',
                        border: '',
                        top: '-35px',
                        marginLeft: '100px',
                      }}
                      value={createAkunpetugas.nama}
                      onChange={(e) =>
                        setcreateAkunpetugas({ ...createAkunpetugas, nama: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="NIP"
                    name="nomorInduk"
                    rules={[{ required: true, message: 'NIP harus di isi' }]}
                    style={{ fontWeight, fontFamily, marginBottom: '-10px' }}
                  >
                    <Input
                      style={{
                        width: '300px',
                        height: '45px',
                        border: '',
                        top: '-35px',
                        marginLeft: '100px',
                      }}
                      value={createAkunpetugas.nomorInduk}
                      onChange={(e) =>
                        setcreateAkunpetugas({ ...createAkunpetugas, nomorInduk: e.target.value })
                      }
                      placeholder="NIP"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Telp"
                    name="telp"
                    rules={[{ required: true, message: 'Telp harus di isi' }]}
                    style={{ fontWeight, fontFamily, marginBottom: '-10px' }}
                  >
                    <Input
                      style={{
                        width: '300px',
                        height: '45px',
                        border: '',
                        top: '-35px',
                        marginLeft: '100px',
                      }}
                      placeholder="Telp"
                      value={createAkunpetugas.telp}
                      onChange={(e) =>
                        setcreateAkunpetugas({ ...createAkunpetugas, telp: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Unggah Foto" name="foto" style={{ fontFamily, fontWeight }}>
                    <Upload
                      listType="picture"
                      beforeUpload={() => false}
                      onChange={(args) => handleChange(args)}
                    >
                      <Button
                        style={{ top: '-30px', marginRight: '50px' }}
                        icon={<UploadOutlined />}
                      >
                        Unggah
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col push={2} span={11}>
                  <Form.Item
                    label="Nama Pengguna"
                    name="username"
                    rules={[{ required: true, message: 'Nama Pengguna harus di isi' }]}
                    style={{ fontWeight, fontFamily, marginBottom: '-10px' }}
                  >
                    <Input
                      style={{
                        width: '300px',
                        height: '45px',
                        border: '',
                        marginLeft: '150px',
                        top: '-35px',
                      }}
                      placeholder="Nama Pengguna"
                      value={createAkunpetugas.username}
                      onChange={(e) =>
                        setcreateAkunpetugas({ ...createAkunpetugas, username: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Sandi"
                    name="password"
                    rules={[{ required: true, message: 'Sandi harus di isi' }]}
                    style={{ fontWeight, fontFamily, marginBottom: '-10px' }}
                  >
                    <Input.Password
                      style={{
                        width: '300px',
                        height: '45px',
                        border: '',
                        marginLeft: '150px',
                        top: '-35px',
                      }}
                      placeholder="Sandi"
                      value={createAkunpetugas.password}
                      onChange={(e) =>
                        setcreateAkunpetugas({ ...createAkunpetugas, password: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Konfirmasi Sandi"
                    name="konfirmasiSandi"
                    style={{ fontWeight, fontFamily }}
                    rules={[
                      { required: true, message: 'Konfirmasi Sandi harus di isi' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error('Konfirmasi Sandi harus sama dengan Sandi.')
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      style={{
                        width: '300px',
                        height: '45px',
                        border: '',
                        marginLeft: '150px',
                        top: '-35px',
                      }}
                      placeholder="Konfirmasi Sandi"
                      onChange={(e) => setKonfirmasiSandi(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button
                  key="cancel"
                  onClick={handleModalCancel}
                  style={{
                    width: '100px',
                    height: '35px',
                    backgroundColor: 'white',
                    borderColor: 'black',
                    color: 'black',
                    marginRight: '10px',
                  }}
                >
                  Batal
                </Button>
                <Button
                  key="save"
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: '100px',
                    height: '35px',
                    backgroundColor: '#582DD2',
                    color: 'white',
                    borderColor: '#582DD2',
                    marginRight: '50px',
                  }}
                >
                  Simpan
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={<div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px' }}>Edit Akun Petugas</div>}
          style={{ textAlign: 'center' }}
          width={600}
          centered
          visible={modalEditVisible}
          onCancel={handleModalCancel}
          footer={null}
          maskStyle={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Form layout="horizontal" onFinish={() => handleEditPetugas(id)}>
            <div style={{ marginTop: '70px', marginRight: '70px' }}>
              <Row gutter={[24, 24]}>
                <Col span={22} offset={1}>
                  <Form.Item
                    label="Nama Pengguna"
                    name="username"
                    rules={[{ required: true, message: 'Nama Pengguna harus di isi' }]}
                    style={{ paddingLeft: '10px'}}
                  >
                    <Input
                      style={{ width: '100%', height: '45px', marginLeft: '30px' }}
                      placeholder="Nama Pengguna"
                      value={updatePetugas.username}
                      onChange={(e) =>
                        setupdatePetugas({ ...updatePetugas, username: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="NIP"
                    name="nomorInduk"
                    rules={[{ required: true, message: 'NIP harus di isi' }]}
                    style={{ paddingLeft: '10px'}}
                  >
                    <Input
                      style={{ width: '100%', height: '45px', marginLeft: '30px' }}
                      placeholder="NIP"
                      value={updatePetugas.nomorInduk || nomorInduk}
                      onChange={(e) =>
                        setupdatePetugas({ ...updatePetugas, nomorInduk: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Telp"
                    name="telp"
                    rules={[{ required: true, message: 'Telp harus di isi' }]}
                    style={{ paddingLeft: '10px'}}

                  >
                    <Input
                      style={{ width: '100%', height: '45px', marginLeft: '30px' }}
                      placeholder="Telp"
                      value={updatePetugas.telp || telp}
                      onChange={(e) => setupdatePetugas({ ...updatePetugas, telp: e.target.value })}
                      maxLength={12}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <Form.Item>
              <div style={{ textAlign: 'right', marginRight: '40px' }}>
                <Button
                  key="cancel"
                  onClick={handleModalCancel}
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'black',
                    color: 'black',
                    marginRight: '10px',
                  }}
                >
                  Batal
                </Button>
                <Button
                  key="save"
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: '#582DD2' }}
                >
                  Simpan
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
      {/* menu inpo */}
      {role === 'admin' && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '90px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Dropdown overlay={menu} placement="bottomCenter">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                style={{
                  width: '200px',
                  height: '50px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="ikon.png"
                    style={{ width: '70px', marginRight: '5px', marginLeft: '-10px' }}
                    alt="ikon"
                  />
                  <div>
                    <div style={{ fontSize: '12px', color: 'black', marginRight: '20px' }}>
                      Halo, {akun?.data?.nama}
                    </div>
                    <div style={{ fontSize: '12px', color: 'grey', marginRight: '75px' }}>
                      {akun?.data?.peran?.Role}
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </Dropdown>
        </div>
      )}
      {role === 'petugas' && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Dropdown overlay={menu} placement="bottomCenter">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                style={{
                  width: '200px',
                  height: '50px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="ikon.png"
                    style={{ width: '70px', marginRight: '5px', marginLeft: '-10px' }}
                    alt="ikon"
                  />
                  <div>
                    <div style={{ fontSize: '12px', color: 'black', marginRight: '20px' }}>
                      Halo, {akun?.data?.nama}
                    </div>
                    <div style={{ fontSize: '12px', color: 'grey', marginRight: '75px' }}>
                      {akun?.data?.peran?.Role}
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </Dropdown>
        </div>
      )}
      {role === 'peminjam' && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Dropdown overlay={menu} placement="bottomCenter">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                style={{
                  width: '190px',
                  height: '50px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="ikon.png"
                    style={{ width: '70px', marginRight: '5px', marginLeft: '-10px' }}
                    alt="ikon"
                  />
                  <div>
                    <div style={{ fontSize: '12px', color: 'black', marginRight: '70px' }}>
                      Halo, {akun?.data?.nama}
                    </div>
                    <div style={{ fontSize: '12px', color: 'grey', marginRight: '75px' }}>
                      {akun?.data?.peran?.Role}
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default Page;
