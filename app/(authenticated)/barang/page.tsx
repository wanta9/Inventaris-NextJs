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

const { Search } = Input;
const { Item } = Menu;
const { Option } = Select;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  kodeBarang: string;
  namaBarang: string;
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
  const [dataSource, setDataSource] = useState<Item[]>([]);
  const [editData, setEditData] = useState<Item | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [letakBarangVisible, setLetakBarangVisible] = useState(false);
  const [letakBarangEditVisible, setLetakBarangEditVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [kodeBarang, setKodeBarang] = useState('');
  const [namaBarang, setNamaBarang] = useState('');
  const [harga, setharga] = useState('');
  const [letakBarang, setLetakBarang] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const fontFamily = 'Barlow, sans-serif';
  const { data: listRuanganBarang } = ruanganBarangRepository.hooks.useRuanganBarang();
  const { data: akun } = akunRepository.hooks.useAuth();

  const router = useRouter();
  const role = akun?.data?.peran?.Role;

  const [openDropdown, setOpenDropdown] = useState(false);

  const handleDropdownClick = () => {
    setOpenDropdown(!openDropdown);
  };

  const menu1 = (
    <Menu>
      <Menu.Item key="1">RPL</Menu.Item>
      <Menu.Item key="2">TKJ</Menu.Item>
      <Menu.Item key="3">TBSM</Menu.Item>
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
  useEffect(() => {
    if (listRuanganBarang != null) {
      setDataSource(listRuanganBarang.data);
    } // Menggunakan setDataSource untuk mengatur nilai initialData
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
    setNamaBarang('');
    setharga('');
    setDeskripsi('');
  };

  const handleSaveModalData = () => {
    if (!namaBarang || !harga || !deskripsi || !letakBarang) {
      message.error('Semua kolom harus diisi.');
      return;
    }

    if (editData) {
      const newData = dataSource.map((item) => {
        if (item.key === editData.key) {
          return { ...item, kodeBarang, namaBarang, letakBarang, harga, deskripsi };
        }
        return item;
      });
      setDataSource(newData);
      setModalEditVisible(false);
      setEditData(null);
    } else {
      const newData: Item = {
        key: count.toString(),
        kodeBarang,
        namaBarang,
        letakBarang,
        harga,
        deskripsi,
      };
      setDataSource([...dataSource, newData]);
      setCount(count + 1);
      setModalVisible(false);
    }

    // Reset state setelah menyimpan data
    setNamaBarang('');
    setharga('');
    setDeskripsi('');
    setLetakBarang('');
  };

  const handleDelete = (key: string) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleEdit = (record: Item) => {
    setEditData(record);
    setKodeBarang(record.kodeBarang);
    setNamaBarang(record.namaBarang);
    setDeskripsi(record.deskripsi);
    setDeskripsi(record.harga);
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
      render: (_, record) => {
        console.log(record);
        return record.barang.kode;
      },
    },
    {
      title: 'Nama Barang',
      dataIndex: 'nama',
      editable: true,
      render: (_, record) => {
        console.log(record);
        return record.barang.nama;
      },
    },
    {
      title: 'Letak Barang',
      dataIndex: 'Letak_Barang',
      editable: true,
      render: (_, record) => {
        console.log(record);
        return record.ruangan.Letak_Barang;
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
              icon={<EditOutlined style={{ color: 'black' }} />}
            />
            <Popconfirm
              title="Hapus Barang"
              onConfirm={() => handleDelete(record.key)} // Memanggil fungsi handleDelete saat Popconfirm dikonfirmasi
              onCancel={(e) => {
                if (e) e.stopPropagation(); // Mencegah penyebaran klik saat cancel
              }}
            >
              <Button
                type="link"
                onClick={(e) => {
                  if (e) e.stopPropagation(); // Menghentikan penyebaran klik ke baris lain
                }}
                icon={<DeleteOutlined style={{ color: 'black' }} />}
              />
            </Popconfirm>
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
              <Search
                placeholder="Telusuri Barang"
                allowClear
                enterButton
                onSearch={(value) => handleSearch(value)}
                style={{ width: 300, marginRight: '400px' }}
              />
              <Dropdown overlay={menu1} placement="bottomLeft">
                <Button
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
                    height: '40px',
                    width: '200px',
                    fontFamily,
                  }}
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
                onClick={handleSaveModalData}
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
          <Modal
            title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>Edit Barang</div>}
            style={{ textAlign: 'center' }}
            centered
            width={1000}
            visible={modalEditVisible}
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
                onClick={handleSaveModalData}
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
                          style={{ marginBottom: '12px', width: '100%', height: '40px' }}
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
                          style={{ marginBottom: '12px', width: '100%', height: '40px' }}
                          addonBefore="Rp"
                          value={harga}
                          placeholder="harga"
                          onChange={handleHargaChange}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row align="middle">
                      <Col span={6}>
                        <p>Deskripsi</p>
                      </Col>
                      <Col span={18}>
                        <Input.TextArea
                          style={{ marginBottom: '12px', width: '100%', height: '80px' }}
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
                  <Col span={8}>
                    <p>Unggah Foto</p>
                  </Col>
                  <Col>
                    <Upload
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      listType="picture"
                    >
                      <Button icon={<UploadOutlined />}>Unggah</Button>
                    </Upload>
                  </Col>
                </Row>
              </Col>
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
              <Button key="cancel" onClick={handleModalCancel}>
                Batal
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={handleSaveModalData}
                style={{ backgroundColor: '#582DD2' }}
              >
                Simpan
              </Button>,
            ]}
          >
            <Row gutter={[24, 24]} style={{ marginTop: '50px', marginBottom: '20px' }}>
              <Col span={6}>
                <p>Letak Barang</p>
              </Col>
              <Col span={18}>
                <Input
                  value={letakBarang}
                  onChange={(e) => setLetakBarang(e.target.value)}
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
              <Search
                placeholder="Telusuri Barang"
                allowClear
                enterButton
                onSearch={(value) => handleSearch(value)}
                style={{ width: 300 }}
              />
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
                onClick={handleSaveModalData}
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
          <Modal
            title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>Edit Barang</div>}
            style={{ textAlign: 'center' }}
            centered
            width={1000}
            visible={modalEditVisible}
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
                onClick={handleSaveModalData}
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
                          style={{ marginBottom: '12px', width: '100%', height: '40px' }}
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
                          style={{ marginBottom: '12px', width: '100%', height: '40px' }}
                          addonBefore="Rp"
                          value={harga}
                          placeholder="harga"
                          onChange={handleHargaChange}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row align="middle">
                      <Col span={6}>
                        <p>Deskripsi</p>
                      </Col>
                      <Col span={18}>
                        <Input.TextArea
                          style={{ marginBottom: '12px', width: '100%', height: '80px' }}
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
                  <Col span={8}>
                    <p>Unggah Foto</p>
                  </Col>
                  <Col>
                    <Upload
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      listType="picture"
                    >
                      <Button icon={<UploadOutlined />}>Unggah</Button>
                    </Upload>
                  </Col>
                </Row>
              </Col>
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
              <Button key="cancel" onClick={handleModalCancel}>
                Batal
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={handleSaveModalData}
                style={{ backgroundColor: '#582DD2' }}
              >
                Simpan
              </Button>,
            ]}
          >
            <Row gutter={[24, 24]} style={{ marginTop: '50px', marginBottom: '20px' }}>
              <Col span={6}>
                <p>Letak Barang</p>
              </Col>
              <Col span={18}>
                <Input
                  value={letakBarang}
                  onChange={(e) => setLetakBarang(e.target.value)}
                  placeholder="Masukkan letak barang"
                  className="uppercase-input"
                />
              </Col>
            </Row>
          </Modal>
        </div>
      )}
      {role === 'peminjam' && (
        <div>
          <div>
            <title>Barang</title>
            <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Barang</h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Search
              placeholder="Telusuri Barang"
              allowClear
              enterButton
              onSearch={handleSearch}
              style={{ width: 300, marginBottom: '40px' }}
            />
            <Select
              placeholder="Pilih Letak Barang"
              style={{ width: 200 }}
              onChange={handleLocationChange}
              allowClear
            >
              <Option value="lokasi1">Lokasi 1</Option>
              <Option value="lokasi2">Lokasi 2</Option>
              <Option value="lokasi3">Lokasi 3</Option>
            </Select>
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
            {listRuanganBarang?.data.map((item, index) => (
              <div
                key={index}
                onClick={() => handleRowClick(item.id)}
                style={{ cursor: 'pointer' }}
              >
                <Card
                  key={index}
                  hoverable
                  style={{
                    width: 240,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
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
                      <img
                        src={listRuanganBarang?.data[0]?.barang?.gambar}
                        alt="Gambar Barang"
                        style={{ width: '100%' }}
                      />
                    </div>
                  }
                >
                  <Meta title={listRuanganBarang?.data[0]?.barang?.nama} description={null} />
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '16px',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    {listRuanganBarang?.data[0]?.barang?.jumlah}
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
