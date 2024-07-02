'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  InputRef,
  Modal,
  Table,
  Select,
  DatePicker,
  Dropdown,
  Menu,
  message,
} from 'antd';
import { EditOutlined, PlusOutlined, ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';
import { barangRusakRepository } from '#/repository/barangrusak';
import dayjs from 'dayjs';
import { akunRepository } from '#/repository/akun';
import { barangRepository } from '#/repository/barang';
import { ruanganRepository } from '#/repository/ruangan';

const { Option } = Select;
const { Search } = Input;
const { Item } = Menu;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

interface createbarangRusak {
  barangId: string;
  ruanganId: string;
  jumlah: string;
  tanggalRusak: string;
  tanggalPerbaikan: string;
  keterangan: string;
  status: string;
}

interface Item {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  harga: string;
  jumlah: string;
  tanggalRusak: string;
  status: string;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

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
  const fontFamily = 'Barlow, sans-serif';
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [editData, setEditData] = useState<Item | null>(null);
  const [count, setCount] = useState(0);
  const [createbarangRusak, setcreatebarangRusak] = useState<createbarangRusak>({
    barangId: '',
    ruanganId: '',
    jumlah: '',
    tanggalRusak: '',
    tanggalPerbaikan: 'null',
    keterangan: '',
    status: 'Rusak',
  });
  const [form] = Form.useForm();
  const { data: listBarangRusak } = barangRusakRepository.hooks.useBarangRusak();
  const { data: listBarang } = barangRepository.hooks.useBarang();
  const { data: listRuangan } = ruanganRepository.hooks.useRuangan();
  const { data: akun } = akunRepository.hooks.useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const role = akun?.data?.peran?.Role;

  const handleDateChange = (date: any, dateString: any) => {
    setcreatebarangRusak({ ...createbarangRusak, tanggalRusak: dateString });
  };

  // klik row
  const handleRowClick = (id: string) => {
    window.location.href = `http://localhost:3002/barangrusak/${id}`;
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
      item.jumlah.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleButtonClick = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setModalEditVisible(false);
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
        jumlah: createbarangRusak.jumlah,
        tanggalRusak: createbarangRusak.tanggalRusak,
        keterangan: createbarangRusak.keterangan,
        status: 'Rusak',
        tanggalPerbaikan: null,
      };
      const request = await barangRusakRepository.api.barangRusak(data);
      if (request.status === 400) {
        setError(request.body.message); 
      } else {
        message.success('Data berhasil disimpan!');
        setModalVisible(false);
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Terjadi kesalahan saat menyimpan data.');
      console.log()
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
    form.setFieldsValue(record.id);
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
        console.log(record);
        return record.ruanganBarang.barang;
      },
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah',
      editable: false,
    },
    {
      title: 'Tanggal Rusak',
      dataIndex: 'tanggalRusak',
      editable: true,
      render: (text: string) => dayjs(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      editable: false,
      render: (status: string, record: any) => (
        <Button
          style={{
            color: '#5BFF00',
            backgroundColor: 'rgba(162, 225, 129, 0.3)',
            borderColor: '#A2E181',
          }}
        >
          {status}
        </Button>
      ),
    },
    {
      title: '',
      dataIndex: '',
      render: (record: Item) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined style={{ color: 'black' }} />}
            // Menetapkan onClick khusus untuk tombol Edit
            onClick={(e) => {
              e.stopPropagation(); // Menghentikan penyebaran klik ke baris lain
              handleEdit(record); // Memanggil fungsi handleEdit saat tombol Edit diklik
            }}
          />
        </span>
      ),
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
      <title>Barang Rusak</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Barang Rusak</h1>
      <Card style={{ marginTop: '100px' }}>
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '16px' }}
        >
          <Search
            placeholder="Telusuri Barang Rusak"
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
            <span style={{ marginRight: '20px', fontFamily }}>Barang Rusak</span>
          </Button>
        </div>
        <Table
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={listBarangRusak?.data}
          onRow={(record) => ({
            onClick: () => handleRowClick(record.id),
            style: { cursor: 'pointer' },
          })}
          columns={mergedColumns as ColumnTypes}
          style={{ marginTop: '30px' }}
        />
      </Card>
      <Modal
        visible={modalEditVisible}
        title={<span style={{ fontWeight: 'bold' }}>Edit Barang Rusak</span>}
        style={{ textAlign: 'center' }}
        onCancel={handleModalCancel}
        centered
        width={900}
        footer={null}
      >
        <Form form={form} layout="horizontal" style={{ marginTop: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, marginRight: '16px' }}>
            <Form.Item
                name="jumlah"
                label="Jumlah"
                colon={false}
                labelAlign="left"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
                rules={[{ required: true, message: 'Tolong isi jumlah!' }]}
              >
                <Input placeholder="Jumlah" style={{ width: '100%', height: '40px' }} />
              </Form.Item>
              <Form.Item
                name="jumlah1"
                label={<span>Jumlah barang<br />rusak</span>}
                colon={false}
                labelAlign="left"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
                rules={[{ required: true, message: 'Tolong isi jumlah!' }]}
              >
                <Input placeholder="Jumlah" style={{ width: '100%', height: '40px' }} />
              </Form.Item>
              <Form.Item
                name="jumlah2"
                label={<span>Jumlah barang<br />perbaikan</span>}
                colon={false}
                labelAlign="left"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
                rules={[{ required: true, message: 'Tolong isi jumlah!' }]}
              >
                <Input placeholder="Jumlah" style={{ width: '100%', height: '40px' }} />
              </Form.Item>
              <Form.Item
                name="tanggalRusak"
                label="Tanggal Rusak"
                colon={false}
                labelAlign="left"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
                rules={[{ required: true, message: 'Tolong pilih tanggal Rusak!' }]}
              >
                <DatePicker placeholder="Tanggal Rusak" style={{ width: '100%', height: '40px' }} disabled />
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
            <Form.Item
                name="tanggalPerbaikan"
                label={<span>Tanggal<br />perbaikan</span>}
                colon={false}
                labelAlign="left"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 15 }}
                rules={[{ required: true, message: 'Tolong pilih tanggal Perbaikan!' }]}
              >
                <DatePicker placeholder="Tanggal Perbaikan" style={{ width: '100%', height: '40px' }} />
              </Form.Item>
              <Form.Item
                name="keterangan"
                label="Keterangan"
                colon={false}
                rules={[{ required: true, message: 'Tolong isi keterangan!' }]}
              >
                <TextArea rows={4} style={{ width: '100%', height: '170px' }} />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
        visible={modalVisible}
        title={<span style={{ fontWeight: 'bold' }}>Tambah Barang Rusak</span>}
        style={{ textAlign: 'center' }}
        centered
        width={900}
        footer={null}
        cancelButtonProps={{ style: { borderColor: 'black', color: 'black' } }}
      >
        <Form form={form} layout="horizontal" style={{ marginTop: '50px' }} onFinish={onFinish}>
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
                name="jumlah"
                label="Jumlah"
                colon={false}
                labelAlign="left"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
                rules={[{ required: true, message: 'Tolong isi jumlah!' }]}
              >
                <Input placeholder="Jumlah" style={{ width: '100%', height: '40px' }} 
                value={createbarangRusak.jumlah}
                onChange={(e) =>
                setcreatebarangRusak({ ...createbarangRusak, jumlah: e.target.value })
                }
                />
              </Form.Item>
              <Form.Item
                name="tanggalRusak"
                label="Tanggal Rusak"
                colon={false}
                labelAlign="left"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
                rules={[{ required: true, message: 'Tolong pilih tanggal Rusak!' }]}
              >
                <DatePicker
                  placeholder="Tanggal Rusak"
                  style={{ width: '100%', height: '40px' }}
                  value={
                    createbarangRusak.tanggalRusak
                      ? dayjs(createbarangRusak.tanggalRusak, 'YYYY-MM-DD')
                      : null
                  }
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <Form.Item
                name="ruanganId"
                label="Ruangan"
                colon={false}
                // Agar ke Kiri Teksnya
                labelAlign="left"
                // Atur Col
                labelCol={{ span: 5 }}
                // Atur lebar Input
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
                <TextArea rows={4} style={{ width: '100%' }} 
                value={createbarangRusak.keterangan}
                onChange={(e) =>
                setcreatebarangRusak({ ...createbarangRusak, keterangan: e.target.value })
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
