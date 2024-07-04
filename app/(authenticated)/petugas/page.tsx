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

const { Search } = Input;
const { Item } = Menu;

const EditableContext = React.createContext<FormInstance<any> | null>(null);
interface Item {
  id: string;
  name: string;
  username: string;
  telp: string;
  nip: string;
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
  nip: string;
}
interface createBarang {
  nama: string;
  nip: string;
  telp: string;
  namaPengguna: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const Page: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [count, setCount] = useState(0);
  const [nama, setNama] = useState('');
  const [nip, setNIP] = useState('');
  const [telp, setTelp] = useState('');
  const [namaPengguna, setNamaPengguna] = useState('');
  const [sandi, setSandi] = useState('');
  const [konfirmasiSandi, setKonfirmasiSandi] = useState('');
  const [createBarang, setcreateBarang] = useState<createBarang>({
    nama: '',
    nip: '',
    telp: '',
    namaPengguna: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [editData, setEditData] = useState<DataType | null>(null);
  const [searchText, setSearchText] = useState('');
  const { data: listPetugas } = petugasRepository.hooks.usePetugas();
  console.log(listPetugas, 'listPetugas');
  const [form] = Form.useForm(); 
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '700';

  const router = useRouter();

  // menu akun
  const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

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

  useEffect(() => {
    setDataSource(filteredData); // Menggunakan setDataSource untuk mengatur nilai initialData
  }, []);

  const filteredData = dataSource.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.username.toLowerCase().includes(searchText.toLowerCase()) ||
      item.nip.toLowerCase().includes(searchText.toLowerCase())
  );

  // const handleChange = async (args: any) => {
  //   const file = args.file;

  //   try {
  //     const createBarang = { file };
  //     const processUpload = await barangRepository.api.uploadBarang(file);
  //     setcreateBarang((createBarang) => ({
  //       ...createBarang,
  //       gambar: processUpload?.body?.data?.filename
  //     }));
  //     console.log(processUpload, "create");
  //     message.success("Gambar Berhasil Di Unggah!")
  //   } catch (e) {
  //     console.log(e, "ini catch e");
  //     // setTimeout(message.eror("Gambar Gagal Di Unggah"))
  //   }
  // }

  const handleButtonClick = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setModalEditVisible(false);
    setNama('');
    setNamaPengguna('');
    setNIP('');
    setTelp('');
  };

  const handleSaveModalData = () => {
    // Validasi input kosong
    form
      .validateFields()
      .then((values) => {
        // Jika semua field tervalidasi
        if (editData) {
          // Jika dalam mode edit, update data yang ada
          const newData = dataSource.map((item) =>
            item.id === editData.id
              ? {
                  ...item,
                  name: values.nama,
                  username: values.namaPengguna,
                  telp: values.telp,
                  nip: values.nip,
                }
              : item
          );
          setDataSource(newData);
          setEditData(null);
          setModalEditVisible(false);
        } else {
          // Jika tidak dalam mode edit, tambahkan data baru
          const newData = {
            id: count.toString(),
            name: values.nama,
            username: values.namaPengguna,
            telp: values.telp,
            nip: values.nip,
          };
          setDataSource([...dataSource, newData]);
          setCount(count + 1);
          setModalVisible(false);
        }
        // Reset form setelah penyimpanan berhasil
        form.resetFields();
      })
      .catch((error) => {
        // Menampilkan pesan error jika ada validasi yang gagal
        console.error('Validation failed:', error);
      });
  };

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.id !== key);
    setDataSource(newData);
  };

  const handleEdit = (record: Item) => {
    setEditData(record);
    setNama(record.name);
    setNamaPengguna(record.username);
    setNIP(record.nip);
    setTelp(record.telp);
    setModalEditVisible(true);
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Nama',
      dataIndex: 'name',
      width: '20%',
      editable: true,
      render: (_, record) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={record.akun?.gambar} />
            <span style={{ marginLeft: 8 }}>{record.akun.nama}</span>
          </div>
        );
      },
    },
    {
      title: 'Nama Pengguna',
      dataIndex: 'username',
      width: '20%',
      editable: true,
      render: (_, record) => {
        return record.akun.username;
      },
    },
    {
      title: 'Telp',
      dataIndex: 'telp',
      width: '20%',
      editable: true,
      render: (_, record) => {
        return record.akun.telp;
      },
    },
    {
      title: 'NIP',
      dataIndex: 'NIP',
      width: '20%',
      editable: true,
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
                e.stopPropagation(); // Menghentikan penyebaran klik ke baris lain
                handleEdit(record); // Memanggil fungsi handleEdit saat tombol Edit diklik
              }}
              icon={<img src="/logoEdit.svg" style={{ width: '19px', height: '19px' }} />}
            />
            <Popconfirm
              title="Hapus Barang"
              onConfirm={() => handleDelete(record.id)} // Memanggil fungsi handleDelete saat Popconfirm dikonfirmasi
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

  return (
    <div>
      <title>Petugas</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Petugas</h1>
      <Card style={{ marginTop: '50px', borderRadius: '20px' }}>
        <Search
          placeholder="Telusuri Petugas"
          allowClear
          enterButton
          onSearch={(value) => handleSearch(value)}
          style={{ width: 300 }}
        />
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
          dataSource={listPetugas?.data}
          pagination={{ pageSize: 5 }}
          columns={columns as ColumnTypes}
          style={{ marginTop: '30px' }}
        />
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
            onFinish={handleSaveModalData}
            initialValues={{
              nama: '',
              nip: '',
              telp: '',
              namaPengguna: '',
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
                      style={{
                        width: '300px',
                        height: '45px',
                        border: '',
                        top: '-35px',
                        marginLeft: '100px',
                      }}
                      placeholder="Nama"
                      onChange={(e) => setNama(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    label="NIP"
                    name="nip"
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
                      placeholder="NIP"
                      onChange={(e) => setNIP(e.target.value)}
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
                      onChange={(e) => setTelp(e.target.value)}
                      maxLength={12}
                    />
                  </Form.Item>
                  <Form.Item label="Unggah Foto" name="foto" style={{ fontFamily, fontWeight }}>
                    <Upload
                      listType="picture"
                      beforeUpload={() => false}
                      // onChange={(args) => handleChange(args)}
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
                    name="namaPengguna"
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
                      onChange={(e) => setNamaPengguna(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Sandi"
                    name="sandi"
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
                      onChange={(e) => setSandi(e.target.value)}
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
                          if (!value || getFieldValue('sandi') === value) {
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
          title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>Edit Akun Petugas</div>}
          style={{ textAlign: 'center' }}
          width={700}
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
          <Form
            layout="horizontal"
            onFinish={handleSaveModalData}
            initialValues={{
              namaPengguna,
              nip,
              telp,
            }}
          >
            <div style={{ marginTop: '70px', marginRight: '70px' }}>
              <Row gutter={[24, 24]}>
                <Col push={2} span={14}>
                  <Form.Item
                    label="Nama Pengguna"
                    name="namaPengguna"
                    rules={[{ required: true, message: 'Nama Pengguna harus di isi' }]}
                  >
                    <Input
                      style={{ width: '300px', height: '45px', border: '' }}
                      placeholder="Nama Pengguna"
                      onChange={(e) => setNamaPengguna(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    label="NIP"
                    name="nip"
                    rules={[{ required: true, message: 'NIP harus di isi' }]}
                  >
                    <Input
                      style={{ width: '300px', height: '45px', border: '' }}
                      placeholder="NIP"
                      onChange={(e) => setNIP(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Telp"
                    name="telp"
                    rules={[{ required: true, message: 'Telp harus di isi' }]}
                  >
                    <Input
                      style={{ width: '300px', height: '45px', border: '' }}
                      placeholder="Telp"
                      onChange={(e) => setTelp(e.target.value)}
                      maxLength={12}
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
                    backgroundColor: 'white',
                    borderColor: 'black',
                    color: 'black',
                    marginRight: '10px',
                  }}
                >
                  Batal
                </Button>
                <Button key="save" type="primary" htmlType="submit" style={{ marginRight: '27px' }}>
                  Simpan
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '100px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Dropdown overlay={menu} placement="bottomCenter">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              style={{
                width: '175px',
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
                />
                <div>
                  <div style={{ fontSize: '12px', color: 'black', marginRight: '20px' }}>
                    Halo, Elisabet
                  </div>
                  <div style={{ fontSize: '12px', color: 'grey ', marginRight: '47px' }}>Admin</div>
                </div>
              </div>
            </Button>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Page;
