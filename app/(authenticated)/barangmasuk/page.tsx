'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  InputRef,
  Modal,
  message,
  Table,
  Select,
  DatePicker,
  Dropdown,
  Menu,
} from 'antd';
import { PlusOutlined, ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import TextArea from 'antd/es/input/TextArea';
import { barangMasukRepository } from '#/repository/barangmasuk';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { Console } from 'console';
import { akunRepository } from '#/repository/akun';
import { ruanganRepository } from '#/repository/ruangan';
import { barangRepository } from '#/repository/barang';
import { relative } from 'path';

const { Option } = Select;
const { Search } = Input;
const { Item } = Menu;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

interface Item {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  harga: string;
  jumlah: string;
  tanggalMasuk: string;
  keterangan: string;
}
interface createbarangMasuk {
  harga: string;
  jumlah: number;
  keterangan: string;
  tanggalMasuk: string;
  barangId: string;
  ruanganId: string;
}

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
        rules={[{ required: true, message: `${title} is required.` }]}
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


type EditableTableProps = Parameters<typeof Table>[0];
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const Page: React.FC = () => {
  const [tanggalMasuk, settanggalMasuk] = useState('');
  const [jumlah, setjumlah] = useState('');
  const [keterangan, setketerangan] = useState('');
  const fontFamily = 'Barlow, sans-serif';
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [editData, setEditData] = useState<Item | null>(null);
  const [count, setCount] = useState(0);
  const [form] = Form.useForm();
  const [createbarangMasuk, setcreatebarangMasuk] = useState<createbarangMasuk>({
    barangId: '',
    ruanganId: '',
    keterangan: '',
    jumlah: 0,
    tanggalMasuk: '',
    harga: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: listBarangMasuk } = barangMasukRepository.hooks.useBarangMasuk();
  const { data: listBarang } = barangRepository.hooks.useBarang();
  const { data: listRuangan } = ruanganRepository.hooks.useRuangan();

  const { data: akun } = akunRepository.hooks.useAuth();
  console.log(listBarangMasuk, 'listBarangMasuk');
  const router = useRouter();
  const role = akun?.data?.peran?.Role;

  // handle tanggalMasuk
  const handleDateChange = (date: any, dateString: any) => {
    setcreatebarangMasuk({ ...createbarangMasuk, tanggalMasuk: dateString });
  };


  // klik row
  const handleRowClick = (id: string) => {
    console.log(id, 'ini record');
    window.location.href = `http://localhost:3002/barangmasuk/${id}`;
  };

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

  const filteredData = dataSource.filter(
    (item) =>
      item.kodeBarang.toLowerCase().includes(searchText.toLowerCase()) ||
      item.namaBarang.toLowerCase().includes(searchText.toLowerCase()) ||
      item.harga.toLowerCase().includes(searchText.toLowerCase()) ||
      item.jumlah.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleButtonClick = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setModalEditVisible(false);
    settanggalMasuk('');
    setketerangan('');
    form.resetFields();
    setEditData(null);
  };

  const onFinish = async (values: any) => {
    console.log('data values: ', values);
    try {
      setLoading(true);
      setError(null);
      const data = {
        barangId: values.barangId,
        ruanganId: values.ruanganId,
        keterangan: createbarangMasuk.keterangan,
        jumlah: createbarangMasuk.jumlah,
        tanggalMasuk: createbarangMasuk.tanggalMasuk,
        harga: 0,
      };
      const request = await barangMasukRepository.api.barangMasuk(data);
      if (request.status === 400) { 
        setError(request.body.message); // Set pesan error
      } else {
        message.success('Data berhasil disimpan!');
        setModalVisible(false);
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Terjadi kesalahan saat menyimpan data.');
      console.log();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (row: Item) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row });
      setDataSource(newData);
    }
  };

  const handleEdit = (record: Item) => {
    setEditData(record);
    settanggalMasuk(record.tanggalMasuk);
    setketerangan(record.keterangan);
    setModalEditVisible(true);
  };

  const columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Kode Barang',
      dataIndex: 'kode',
      editable: false,
    },
    {
      title: 'Nama Barang',
      dataIndex: 'nama',
      editable: false,
      render: (_, record) => {
        return record.ruanganBarang.barang.nama;
      },
    },
    {
      title: 'Harga',
      dataIndex: 'harga',
      editable: false,
      render: (_, record) => {
        const formatRupiah = (number: number) => {
          return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
            number
          );
        };
        const hargaFormatted = formatRupiah(record.ruanganBarang.barang.harga);
        return hargaFormatted;
      },
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah',
      editable: false,
    },
    {
      title: 'Tanggal Masuk',
      dataIndex: 'tanggalMasuk',
      editable: true,
      render: (text: string) => dayjs(text).format('DD-MM-YYYY'),
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

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <title>Barang Masuk</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Barang Masuk</h1>
      <Card style={{ marginTop: '100px' }}>
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '16px' }}
        >
          <Search
            placeholder="Telusuri Barang Masuk"
            allowClear
            enterButton
            onSearch={(value) => handleSearch(value)}
            style={{ width: 300, marginRight: '100vh' }}
          />
          <Button
            type="primary"
            onClick={handleButtonClick}
            icon={<PlusOutlined style={{ marginTop: '4px', marginRight: '10px' }} />}
            style={{
              backgroundColor: 'white',
              boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
              color: 'black',
              marginRight: '20px',
              width: '200px',
              height: '40px',
            }}
          >
            <span style={{ marginRight: '20px', fontFamily }}>Barang Masuk</span>
          </Button>
        </div>
        <Table
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={filteredData.length > 0 ? filteredData : listBarangMasuk?.data}
          onRow={(record) => {
            return {
              onClick: () => handleRowClick(record.id),
              style: { cursor: 'pointer' },
            };
          }}
          columns={mergedColumns as ColumnTypes}
          style={{ marginTop: '30px' }}
        />
      </Card>
      <Modal
        title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>Tambah Barang Masuk</div>}
        style={{ textAlign: 'center' }}
        centered
        footer={null}
        width={900}
        visible={modalVisible}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="horizontal" style={{ marginTop: '70px' }} onFinish={onFinish}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, marginRight: '16px' }}>
              <Form.Item
                name="barangId"
                label="Kode Barang"
                style={{ textAlign: 'left' }}
                colon={false}
                labelAlign="left"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
                rules={[{ required: true, message: 'Tolong isi kode barang!' }]}
              >
                <Select
                  placeholder="Pilih Kode Barang"
                  style={{ width: '100%', height: '40px', textAlign: 'left' }}
                >
                  {listBarang?.data?.map((barang: any) => (
                    <Option key={barang.id} value={barang.id}>
                      {barang.kode}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="tanggalMasuk"
                label="Tanggal Masuk"
                colon={false}
                labelAlign="left"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
                rules={[{ required: true, message: 'Tolong pilih tanggal masuk!' }]}
              >
                <DatePicker
                  placeholder="Tanggal Masuk"
                  style={{ width: '100%', height: '40px' }}
                  value={
                    createbarangMasuk.tanggalMasuk
                      ? dayjs(createbarangMasuk.tanggalMasuk, 'YYYY-MM-DD')
                      : null
                  }
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
              <Form.Item
                name="jumlah"
                label="Jumlah"
                colon={false}
                labelAlign="left"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
                rules={[{ required: true, message: 'Tolong isi jumlah!' }]}
              >
                <Input
                  placeholder="Jumlah"
                  style={{ width: '100%', height: '40px' }}
                  value={createbarangMasuk.jumlah}
                  onChange={(e) =>
                    setcreatebarangMasuk({ ...createbarangMasuk, jumlah: Number(e.target.value) })
                  }
                />
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <Form.Item
                name="ruanganId"
                label="Ruangan"
                colon={false}
                labelAlign="left"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 8 }}
                rules={[{ required: true, message: 'Tolong pilih ruangan!' }]}
              >
                <Select
                  placeholder="Pilih Ruangan"
                  style={{ width: '100%', height: '40px', textAlign: 'left' }}
                >
                  {listRuangan?.data?.map((ruangan) => (
                    <Option key={ruangan.id} value={ruangan.id}>
                      {ruangan.Letak_Barang}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="keterangan"
                label="Keterangan"
                colon={false}
                rules={[{ required: true, message: 'Tolong isi keterangan!' }]}
              >
                <TextArea
                  rows={4}
                  style={{ width: '100%' }}
                  value={createbarangMasuk.keterangan}
                  onChange={(e) =>
                    setcreatebarangMasuk({ ...createbarangMasuk, keterangan: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: '#582DD2',
                    display: 'absolute',
                    marginRight: '-150px',
                    marginBottom: '-40px',
                  }}
                >
                  <span>Simpan</span>
                </Button>
                <Button
                  type="default"
                  onClick={handleModalCancel}
                  style={{
                    display: 'absolute',
                    marginBottom: '-40px',
                  }}
                >
                  <span>Batal</span>
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
      centered
      title={<div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '20px' }}>Edit Barang Masuk</div>}
      style={{ textAlign: 'center'}}
      visible={modalEditVisible}
      onCancel={handleModalCancel}
      footer={null}
      >
      <Form.Item
        name="tanggalMasuk"
        label="Tanggal Masuk"
        colon={false}
        labelAlign="left"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 16 }}
        rules={[{ required: true, message: 'Tolong pilih tanggal masuk!' }]}
        style={{  marginTop: '60px', marginLeft: '20px'}}
        >
          <DatePicker
            placeholder="Tanggal Masuk"
            style={{ width: '100%', height: '40px' }}
            value={
            createbarangMasuk.tanggalMasuk
              ? dayjs(createbarangMasuk.tanggalMasuk, 'YYYY-MM-DD')
              : null
          }
            onChange={handleDateChange}
            format="YYYY-MM-DD"
          />
          </Form.Item>     
          <Form.Item
                name="keterangan"
                label="Keterangan"
                colon={false}
                labelAlign="left"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                rules={[{ required: true, message: 'Tolong isi keterangan!' }]}
                style={{ marginLeft: '20px' }}
              >
                <TextArea
                  rows={4}
                  style={{ width: '100%', marginLeft: '20px' }}
                  value={createbarangMasuk.keterangan}
                  onChange={(e) =>
                    setcreatebarangMasuk({ ...createbarangMasuk, keterangan: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                style={{ position: 'relative', display: 'flex' }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: '90px',
                    backgroundColor: '#582DD2',
                    position: 'absolute',
                    left: '360px',
                  }}
                >
                  <span>Simpan</span>
                </Button>
                <Button
                  type="default"
                  onClick={handleModalCancel}
                  style={{
                    position: 'absolute',
                    left: '290px',
                    borderColor: 'black',
                    color: 'black',
                  }}
                >
                  <span>Batal</span>
                </Button>
              </Form.Item>
      </Modal>
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
