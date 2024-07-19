'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputRef,
  Menu,
  Modal,
  Popconfirm,
  Row,
  Table,
  Upload,
  message,
  Dropdown,
  Select,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  RightOutlined,
  DownOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { useRouter } from 'next/navigation';
import { ruanganBarangRepository } from '#/repository/ruanganbarang';
import { akunRepository } from '#/repository/akun';
import Meta from 'antd/es/card/Meta';
import { barangRepository } from '#/repository/barang';
import { argv } from 'process';
import { ruanganRepository } from '#/repository/ruangan';

const { Search } = Input;
const { Item } = Menu;
const { Option } = Select;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface updateBarang {
  id: string;
  nama: string;
  harga: string;
  deskripsi: string;
  // gambar: string;
}
interface createLetakbarang {
  Letak_Barang: string;
}
interface createBarang {
  nama: string;
  harga: string;
  deskripsi: string;
  gambar: string;
}

interface Item {
  id: string;
  kodeBarang: string;
  nama: string;
  letakBarang: string;
  harga: string;
  deskripsi: string;
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
  key: React.Key;
  name: string;
  username: string;
  telp: string;
  nip: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const Page: React.FC = () => {
  const [editData, setEditData] = useState<Item | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [letakBarangVisible, setLetakBarangVisible] = useState(false);
  const [letakBarangEditVisible, setLetakBarangEditVisible] = useState(false);
  const [createLetakbarang, setcreateLetakbarang] = useState<createLetakbarang>({
    Letak_Barang: '',
  });
  const [createBarang, setcreateBarang] = useState<createBarang>({
    nama: '',
    harga: '',
    deskripsi: '',
    gambar: '',
  });
  const [updateBarang, setupdateBarang] = useState<updateBarang>({
    id: '',
    nama: '',
    harga: '',
    deskripsi: '',
    // gambar: '',
  });
  const [count, setCount] = useState(0);
  const [kodeBarang, setKodeBarang] = useState('');
  const [namaBarang, setNamaBarang] = useState('');
  const [harga, setharga] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fontFamily = 'Barlow, sans-serif';
  const { data: listRuanganBarang, mutate: mutateListBarang } = barangRepository.hooks.useBarang();
  const { data: listRuangan, mutate: mutateListRuangan } = ruanganRepository.hooks.useRuangan();
  console.log(listRuanganBarang, 'list ruangan');
  const fontWeight = '650';
  const { data: akun } = akunRepository.hooks.useAuth();
  const [form] = Form.useForm();
  const router = useRouter();
  const role = akun?.data?.peran?.Role;
  const [id, setId] = useState<string>('');
  

  const [openDropdown, setOpenDropdown] = useState(false);
  const formatRupiah = (number: any) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(number);
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

  const handleDropdownClick = () => {
    setOpenDropdown(!openDropdown);
  };

  const menu1 = (
    <Menu>
      {listRuangan?.data?.map((ruangan) => (
        <Menu.Item key={ruangan.id}>{ruangan.Letak_Barang}</Menu.Item>
      ))}
    </Menu>
  );

  const handleRowClick = (id: string) => {
    window.location.href = `http://localhost:3002/barang/${id}`;
  };

  // menu akun
  const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  const profile = () => {
    router.push('/profile');
  };

  const menu = (
    <Menu>
      {role === 'petugas' && (
        <Item key="1" onClick={() => profile()}>
          <a style={{ color: 'black' }} target="_blank" rel="noopener noreferrer">
            <UserOutlined style={{ color: 'black', marginRight: '10px' }} />
            Profile
          </a>
        </Item>
      )}
      {role === 'peminjam' && (
        <Item key="1" onClick={() => profile()}>
          <a style={{ color: 'black' }} target="_blank" rel="noopener noreferrer">
            <UserOutlined style={{ color: 'black', marginRight: '10px' }} />
            Profile
          </a>
        </Item>
      )}
      <Item key="2" onClick={() => logout()}>
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

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (listRuanganBarang != null) {
      setDataSource(listRuanganBarang.data);
    }
  }, [listRuanganBarang]);

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
  };

  const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Menghilangkan semua karakter kecuali angka
    setharga(value);
  };

  const handleButtonClick = (type: string) => {
    if (type === 'barang') {
      setModalVisible(true);
      setLetakBarangVisible(false); // Menutup modal tambah letak barang jika ada
    } else if (type === 'letakBarang') {
      setLetakBarangVisible(true);
      setModalVisible(false); // Menutup modal tambah barang jika ada
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setModalEditVisible(false);
    setLetakBarangVisible(false);
    setEditData(null);
  };

  // CREATE BARANG
  const handleSaveBarang = async (values: any) => {
    console.log('data values: ', values);
    try {
      setLoading(true);
      setError(null);

      const data = {
        nama: createBarang.nama,
        harga: createBarang.harga,
        deskripsi: createBarang.deskripsi,
        gambar: createBarang.gambar, // Menggunakan gambar yang diunggah
        kondisi: 'baik',
        jumlah: 0,
      };
      const request = await barangRepository.api.barang(data);
      if (request.status === 400) {
        setError(request.body.message); // Set pesan error
      } else {
        message.success('Berhasil Menambahkan Barang!');
        setModalVisible(false);
        await mutateListBarang();
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Gagal Menambahkan Barang');
    } finally {
      setLoading(false);
    }
  };

  // SAVE EDIT BARANG
  const handleEditbarang = async (id: string) => {
    // console.log('data values: ', values);
    try {
      setLoading(true);
      setError(null);
      const data = {
        nama: updateBarang.nama,
        harga: updateBarang.harga,
        deskripsi: updateBarang.deskripsi,
        // // gambar: updateBarang.gambar,
      };
      const request = await barangRepository.api.updateBarang(id, data);
      if (request.status === 400) {
        setError(request.body.message); // Set pesan error
      } else {
        message.success('Berhasil Mengedit Barang!');
        setModalEditVisible(false);
        await mutateListBarang();
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Gagal Mengedit Barang');
    } finally {
      setLoading(false);
    }
  };

  // CREATE LETAK BARANG
  const handleSaveLetakBarang = async (values: any) => {
    console.log('data values: ', values);
    try {
      setLoading(true);
      setError(null);

      const data = {
        Letak_Barang: createLetakbarang.Letak_Barang,
      };
      const request = await ruanganRepository.api.ruangan(data);
      if (request.status === 400) {
        setError(request.body.message); // Set pesan error
      } else {
        message.success('Berhasil Menambahkan Letak Barang!');
        setLetakBarangVisible(false);
        await mutateListRuangan();
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Gagal Menambahkan Letak Barang');
    } finally {
      setLoading(false);
    }
  };

  // UPLOAD GAMBAR
  const handleChange = async (args: any) => {
    const file = args.file;

    try {
      const createBarang = { file };
      const processUpload = await barangRepository.api.uploadBarang(file);
      setcreateBarang((createBarang) => ({
        ...createBarang,
        gambar: processUpload?.body?.data?.filename,
      }));
      console.log(processUpload, 'create');
      message.success('Gambar Berhasil Di Unggah!');
    } catch (e) {
      console.log(e, 'ini catch e');
      // setTimeout(message.eror("Gambar Gagal Di Unggah"))
    }
  };

  // const handleUpdate = async (args: any) => {
  //   const file = args.file;

  //   try {
  //     const updateBarang = { file };
  //     const processUpload = await barangRepository.api.updateBarang(file);
  //     setupdateBarang((updateBarang) => ({
  //       ...updateBarang,
  //       gambar: processUpload?.body?.data?.filename,
  //     }));
  //     console.log(processUpload, 'update');
  //     message.success('Gambar Berhasil Diperbarui!');
  //   } catch (e) {
  //     console.log(e, 'ini catch e');
  //     message.error('Gambar Gagal Diperbarui!');
  //   }
  // };

  const handleDelete = (key: string) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleEdit = (record: Item) => {
    setId(record.id);
    setEditData(record);
    setKodeBarang(record.kodeBarang);
    setNamaBarang(record.nama);
    setharga(record.harga);
    setDeskripsi(record.deskripsi);
    setModalEditVisible(true);
  };

  const handleSave = (row: Item) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    newData.splice(index, 1, {
      ...newData[index],
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
      handleSave,
    },
  };

  const columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Kode Barang',
      dataIndex: 'kode',
      editable: true,
    },
    {
      title: 'Nama Barang',
      dataIndex: 'nama',
      editable: true,
    },
    {
      title: 'Letak Barang',
      dataIndex: 'Letak_Barang',
      editable: true,
      render: (_, record) => {
        if (record.ruanganBarang && record.ruanganBarang.length > 0) {
          return record.ruanganBarang[0].ruangan.Letak_Barang;
        }
        return null;
      },
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah',
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
          </span>
        );
      },
    },
  ];

  return (
    <div>
      {role === 'admin' && (
        <div>
          <title>Barang</title>
          <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Barang</h1>
          <Card style={{ marginTop: '50px', borderRadius: '20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '20px',
                marginBottom: '16px',
              }}
            >
              <div ref={searchRef}>
                <Search
                  placeholder="Telusuri Barang Masuk"
                  className="custom-search"
                  allowClear
                  enterButton
                  onSearch={() => {}}
                  style={{ width: 300, marginRight: '500px', height: '40px' }}
                />
              </div>
              <Dropdown
                overlay={menu1}
                placement={openDropdown ? 'bottomLeft' : 'bottomRight'}
                visible={openDropdown}
                onVisibleChange={setOpenDropdown}
              >
                <Button
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
                    height: '40px',
                    width: '200px',
                    fontFamily: 'inherit',
                    marginLeft: '10px',
                  }}
                  onClick={handleDropdownClick}
                >
                  Letak Barang{' '}
                  {openDropdown ? (
                    <DownOutlined style={{ fontSize: '12px' }} />
                  ) : (
                    <RightOutlined style={{ fontSize: '12px' }} />
                  )}
                </Button>
              </Dropdown>
              <Button
                type="primary"
                onClick={() => handleButtonClick('letakBarang')}
                icon={<PlusOutlined />}
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
                  height: '40px',
                  width: '200px',
                  fontFamily,
                }}
              >
                Letak Barang
              </Button>
              <Button
                type="primary"
                onClick={() => handleButtonClick('barang')}
                icon={<PlusOutlined style={{}} />}
                style={{
                  backgroundColor: 'white',
                  boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
                  color: 'black',
                  height: '40px',
                  width: '200px',
                  fontFamily,
                }}
              >
                <span style={{ marginRight: '10px' }}>Barang</span>
              </Button>
            </div>
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={listRuanganBarang?.data}
              onRow={(record) => ({
                onClick: () => handleRowClick(record.id),
                style: { cursor: 'pointer' },
              })}
              pagination={{ pageSize: 5 }}
              columns={columns as ColumnTypes}
              style={{ marginTop: '40px' }}
            />
          </Card>
          <Modal
            title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>Tambah Barang</div>}
            style={{ textAlign: 'center' }}
            centered
            width={900}
            visible={modalVisible}
            onCancel={handleModalCancel}
            footer={[
              <Button
                key="cancel"
                onClick={handleModalCancel}
                style={{ backgroundColor: 'white', borderColor: 'black', color: 'black' }}
              >
                Batal
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={handleSaveBarang}
                style={{
                  marginRight: '27px',
                  backgroundColor: '#582DD2',
                  color: 'white',
                  borderColor: '#582DD2',
                }}
                loading={loading}
              >
                Simpan
              </Button>,
            ]}
            maskStyle={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <Form form={form}>
              <Row gutter={[24, 24]} style={{ marginTop: '70px' }}>
                <Col span={16}>
                  <Row gutter={[24, 24]}>
                    <Col span={24}>
                      <Row align="middle">
                        <Col span={6}>
                          <p style={{ fontWeight }}>Nama Barang</p>
                        </Col>
                        <Col span={18}>
                          <Input
                            style={{ marginBottom: '12px', width: '75%', height: '40px' }}
                            placeholder="Nama Barang"
                            value={createBarang.nama}
                            onChange={(e) =>
                              setcreateBarang({ ...createBarang, nama: e.target.value })
                            }
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row align="middle">
                        <Col span={6}>
                          <p style={{ fontWeight }}>Harga</p>
                        </Col>
                        <Col span={18}>
                          <Input
                            style={{ marginBottom: '12px', width: '75%', height: '40px' }}
                            prefix="Rp"
                            value={createBarang.harga}
                            onChange={(e) =>
                              setcreateBarang({ ...createBarang, harga: e.target.value })
                            }
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row align="middle">
                        <Col span={6}>
                          <p style={{ marginBottom: '80px', fontWeight }}>Deskripsi</p>
                        </Col>
                        <Col span={18}>
                          <Input.TextArea
                            style={{ marginBottom: '12px', width: '75%', height: '50%' }}
                            rows={4}
                            placeholder="Deskripsi Barang"
                            // value={createBarang.deskripsi}
                            onChange={(e) =>
                              setcreateBarang({ ...createBarang, deskripsi: e.target.value })
                            }
                            // onChange={(e) => console.log(e.target.value, "deskripsi")}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col>
                      <p style={{ marginLeft: '-40px', marginRight: '20px', fontWeight }}>
                        Unggah Foto
                      </p>
                    </Col>
                    <Col>
                      <Upload
                        listType="picture"
                        beforeUpload={() => false}
                        onChange={(args) => handleChange(args)}
                      >
                        <Button icon={<UploadOutlined />} style={{ marginRight: '50px' }}>
                          Unggah
                        </Button>
                      </Upload>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Modal>
          <Modal
            title={
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '20px' }}>
                Edit Barang
              </div>
            }
            style={{ textAlign: 'center' }}
            centered
            visible={modalEditVisible}
            onCancel={handleModalCancel}
            width={1000}
            footer={[
              <Button
                key="cancel"
                onClick={handleModalCancel}
                style={{ backgroundColor: 'white', borderColor: 'black', color: 'black' }}
              >
                Batal
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={() => handleEditbarang(id)}
                style={{
                  marginRight: '27px',
                  backgroundColor: '#582DD2',
                  color: 'white',
                  borderColor: '#582DD2',
                }}
              >
                Simpan
              </Button>,
            ]}
            maskStyle={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <Row gutter={[24, 24]} style={{ marginTop: '70px' }}>
              <Col span={16}>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Row align="middle">
                      <Col span={6}>
                        <p style={{ fontWeight }}>Nama Barang</p>
                      </Col>
                      <Col span={18}>
                        <Input
                          style={{
                            marginBottom: '12px',
                            width: '75%',
                            height: '40px',
                            borderColor: 'black',
                          }}
                          placeholder="Nama Barang"
                          value={updateBarang.nama}
                          onChange={(e) =>
                            setupdateBarang({ ...updateBarang, nama: e.target.value })
                          }
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row align="middle">
                      <Col span={6}>
                        <p style={{ fontWeight }}>Harga</p>
                      </Col>
                      <Col span={18}>
                        <Input
                          style={{
                            marginBottom: '12px',
                            width: '75%',
                            height: '40px',
                            borderColor: 'black',
                          }}
                          prefix="Rp"
                          placeholder="Harga"
                          value={updateBarang.harga}
                          onChange={(e) =>
                            setupdateBarang({ ...updateBarang, harga: e.target.value })
                          }
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row align="middle">
                      <Col span={6}>
                        <p style={{ fontWeight }}>Deskripsi</p>
                      </Col>
                      <Col span={18}>
                        <Input.TextArea
                          style={{
                            marginBottom: '12px',
                            width: '75%',
                            height: '80px',
                            borderColor: 'black',
                          }}
                          placeholder="Deskripsi Barang"
                          value={updateBarang.deskripsi}
                          onChange={(e) =>
                            setupdateBarang({ ...updateBarang, deskripsi: e.target.value })
                          }
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              {/* <Col span={8}>
              <Form.Item
              name="gambar"
              >
              <Row>
                <Col span={8}>
                  <p style={{ fontWeight }}>Unggah Foto</p>
                </Col>
                <Col>
                <Upload
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture"
                  beforeUpload={() => false}
                  onChange={(args) => handleUpdate(args)}
                >
                 <Button
                   style={{ color: 'black', borderColor: 'black' }}
                   icon={<UploadOutlined />}
                  >
                   Unggah
                 </Button>
                </Upload>
                </Col>
              </Row>
              </Form.Item>
              </Col> */}
              {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button
                    type="default"
                    onClick={handleModalCancel}
                    style={{
                    marginBottom: '40px',
                    marginLeft: '45vh',
                    marginRight: '10px',
                  }}
                  >
                    <span>Batal</span>
                  </Button>
                    <Button
                    onClick={handleEditbarang}
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: '#582DD2',
                      marginBottom: '40px',
                    }}
                  >
                  <span>Simpan</span>
                </Button>
               </div> */}
            </Row>
          </Modal>
          {/* Button Tambah Letak barang */}
          <Modal
            title="Tambah Letak Barang"
            visible={letakBarangVisible || letakBarangEditVisible}
            centered
            style={{ textAlign: 'center' }}
            onCancel={handleModalCancel}
            footer={[
              <Button key="cancel" onClick={handleModalCancel} style={{ borderColor: 'black' }}>
                Batal
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={handleSaveLetakBarang}
                style={{ backgroundColor: '#582DD2' }}
              >
                Simpan
              </Button>,
            ]}
          >
            <Row gutter={[24, 24]} style={{ marginTop: '50px', marginBottom: '20px' }}>
              <Col span={6}>
                <p>Nama Ruangan</p>
              </Col>
              <Col span={18}>
                <Input
                  value={createLetakbarang.Letak_Barang}
                  onChange={(e) =>
                    setcreateLetakbarang({ ...createLetakbarang, Letak_Barang: e.target.value })
                  }
                  placeholder="Masukkan letak barang"
                  className="uppercase-input"
                />
              </Col>
            </Row>
          </Modal>
        </div>
      )}
      {role === 'petugas' && (
        <div>
          <title>Barang</title>
          <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Barang</h1>
          <Card style={{ marginTop: '50px', borderRadius: '20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <div ref={searchRef}>
                <Search
                  placeholder="Telusuri Barang Masuk"
                  className="custom-search"
                  allowClear
                  enterButton
                  onSearch={() => {}}
                  style={{ width: 300, marginRight: '950px', height: '40px' }}
                />
              </div>
              <Dropdown
                overlay={menu1}
                placement={openDropdown ? 'bottomLeft' : 'bottomRight'}
                visible={openDropdown}
                onVisibleChange={setOpenDropdown}
              >
                <Button
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
                    height: '40px',
                    width: '200px',
                    fontFamily: 'inherit',
                    marginLeft: '10px', // Margin here
                  }}
                  onClick={handleDropdownClick}
                >
                  Letak Barang{' '}
                  {openDropdown ? (
                    <DownOutlined style={{ fontSize: '12px' }} />
                  ) : (
                    <RightOutlined style={{ fontSize: '12px' }} />
                  )}
                </Button>
              </Dropdown>
            </div>
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={listRuanganBarang?.data}
              onRow={(record) => ({
                onClick: () => handleRowClick(record.id),
                style: { cursor: 'pointer' },
              })}
              pagination={{ pageSize: 5 }}
              columns={columns as ColumnTypes}
              style={{ marginTop: '40px' }}
            />
          </Card>
          <Modal
            title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>Tambah Barang</div>}
            style={{ textAlign: 'center' }}
            centered
            width={900}
            visible={modalVisible}
            onCancel={handleModalCancel}
            footer={[
              <Button
                key="cancel"
                onClick={handleModalCancel}
                style={{ backgroundColor: 'white', borderColor: 'black', color: 'black' }}
              >
                Batal
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={handleSaveBarang}
                style={{
                  marginRight: '27px',
                  backgroundColor: '#582DD2',
                  color: 'white',
                  borderColor: '#582DD2',
                }}
              >
                Simpan
              </Button>,
            ]}
            maskStyle={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <Row gutter={[24, 24]} style={{ marginTop: '70px' }}>
              <Col span={16}>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Row align="middle">
                      <Col span={6}>
                        <p>Nama Barang</p>
                      </Col>
                      <Col span={18}>
                        <Input
                          style={{ marginBottom: '12px', width: '75%', height: '40px' }}
                          placeholder="Nama Barang"
                          value={namaBarang}
                          onChange={(e) => setNamaBarang(e.target.value)}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row align="middle">
                      <Col span={6}>
                        <p>Harga</p>
                      </Col>
                      <Col span={18}>
                        <Input
                          style={{ marginBottom: '12px', width: '75%', height: '40px' }}
                          prefix="Rp"
                          value={harga}
                          onChange={handleHargaChange}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row align="middle">
                      <Col span={6}>
                        <p style={{ marginBottom: '80px' }}>Deskripsi</p>
                      </Col>
                      <Col span={18}>
                        <Input.TextArea
                          style={{ marginBottom: '12px', width: '75%', height: '50%' }}
                          rows={4}
                          placeholder="Deskripsi Barang"
                          value={deskripsi}
                          onChange={(e) => setDeskripsi(e.target.value)}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Row>
                  <Col>
                    <p style={{ marginLeft: '-40px', marginRight: '20px' }}>Unggah Foto</p>
                  </Col>
                  <Col>
                    <Upload
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      listType="picture"
                    >
                      <Button icon={<UploadOutlined />} style={{ marginRight: '50px' }}>
                        Unggah
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Modal>
        </div>
      )}
      {role === 'peminjam' && (
        <div>
          <div>
            <title>Barang</title>
            <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '30px' }}>Barang</h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div ref={searchRef}>
              <Search
                placeholder="Telusuri Barang "
                className="custom-search"
                allowClear
                enterButton
                onSearch={() => {
                  handleSearch;
                }}
                style={{ width: 300, marginRight: '500px', height: '40px', marginTop: '10px' }}
              />
            </div>
            <Dropdown
              overlay={menu1}
              placement={openDropdown ? 'bottomLeft' : 'bottomRight'}
              visible={openDropdown}
              onVisibleChange={setOpenDropdown}
            >
              <Button
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
                  height: '40px',
                  width: '200px',
                  fontFamily: 'inherit',
                  marginRight: '40px',
                }}
                onClick={handleDropdownClick}
              >
                Letak Barang{' '}
                {openDropdown ? (
                  <DownOutlined style={{ fontSize: '12px' }} />
                ) : (
                  <RightOutlined style={{ fontSize: '12px' }} />
                )}
              </Button>
            </Dropdown>
          </div>
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
              <div style={{ display: 'flex', alignItems: 'center' }}></div>
            </Dropdown>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {dataSource.map((item, index) => (
              <div
                key={index}
                onClick={() => handleRowClick(item.id)}
                style={{ cursor: 'pointer' }}
              >
                <Card
                  hoverable
                  style={{
                    width: 240,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    marginTop: '30px',
                  }}
                  cover={
                    <div
                      style={{
                        position: 'relative',
                        backgroundColor: '#D9D9D9',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '160px',
                      }}
                    >
                      <img src={item.gambar} alt="Gambar Barang" style={{ width: '100%' }} />
                    </div>
                  }
                >
                  <Meta title={item.nama} description={null} />
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '16px',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    {item.jumlah}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* tutup  */}
      {/* menu inpo */}
      {role === 'admin' && (
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
            right: '100px',
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
            right: '100px',
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
