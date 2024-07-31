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
import { Console } from 'console';
import { set } from 'mobx';

const { Option } = Select;
const { Search } = Input;
const { Item } = Menu;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

interface updateBarangrusak {
  id: string;
  jumlah: number;
  jmlbarangrusak: number;
  perbaikan: number;
  tanggalRusak: string;
  tanggalPerbaikan: string;
  status: string;
  keterangan: string;
}

interface createbarangRusak {
  barangId: string;
  ruanganId: string;
  jumlah: number;
  tanggalRusak: string;
  tanggalPerbaikan: string;
  keterangan: string;
  status: string;
}

interface Item {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  jumlah: number;
  barangRusak: number;
  jmlbarangrusak: number;
  tanggalRusak: string;
  perbaikan: number;
  tanggalPerbaikan: string;
  keterangan: string;
  status: string;
  createdAt?: any;
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
    jumlah: 0,
    tanggalRusak: '',
    tanggalPerbaikan: '',
    keterangan: '',
    status: 'Rusak',
  });

  const [updateBarangrusak, setupdateBarangrusak] = useState<updateBarangrusak>({
    id: '',
    jumlah: 0,
    jmlbarangrusak: 0,
    perbaikan: 0,
    tanggalRusak: '',
    tanggalPerbaikan: '',
    status: '',
    keterangan: '',
  });
  const [form] = Form.useForm();
  const { data: listSearchBarangrusak } = barangRusakRepository.hooks.useBarangRusakByName(searchText);
  console.log( listSearchBarangrusak, 'listSearchBarangrusak');
  const { data: listBarangRusak } = barangRusakRepository.hooks.useBarangRusak();
  console.log(listBarangRusak, 'listBarangRusak');
  const { data: listBarang } = barangRepository.hooks.useBarang();
  const { data: listRuangan } = ruanganRepository.hooks.useRuangan();
  const { data: akun } = akunRepository.hooks.useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [barangRusak, setJumlah] = useState<string | number>('');
  const [jmlbarangrusak, setJmlbarangrusak] = useState<string | number>('');
  const [perbaikan, setPerbaikan] = useState<string | number>('');
  const [status, setStatus] = useState('');
  const [tanggalRusak, settanggalRusak] = useState('');
  const [tanggalPerbaikan, settanggalPerbaikan] = useState('');
  const [keterangan, setketerangan] = useState('');
  const [id, setId] = useState<string>('');
  const searchRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const role = akun?.data?.peran?.Role;

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

  const handleDateChange = (date: any, dateString: any) => {
    setcreatebarangRusak({ ...createbarangRusak, tanggalRusak: dateString });
    setupdateBarangrusak({ ...updateBarangrusak, tanggalRusak: dateString });
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
  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
  };

  // const filteredData = dataSource.filter(
  //   (item) =>
  //     item.kodeBarang.toLowerCase().includes(searchText.toLowerCase()) ||
  //     item.namaBarang.toLowerCase().includes(searchText.toLowerCase()) ||
  //     item.jumlah.toLowerCase().includes(searchText.toLowerCase())
  // );

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
        status: 'rusak',
        tanggalPerbaikan: createbarangRusak.tanggalPerbaikan,
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
      console.log();
    } finally {
      setLoading(false);
    }
  };

  const onFinishEdit = async (id: string) => {
    console.log('data id: ', id);
    try {
      setLoading(true);
      setError(null);
      const data = {
        jumlah: updateBarangrusak.jumlah,
        jmlbarangrusak: updateBarangrusak.jmlbarangrusak,
        perbaikan: updateBarangrusak.perbaikan,
        tanggalRusak: updateBarangrusak.tanggalRusak,
        tanggalPerbaikan: updateBarangrusak.tanggalPerbaikan,
        keterangan: updateBarangrusak.keterangan,
      };
      const request = await barangRusakRepository.api.updateBarangrusak(id, data);
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
    console.log('record data: ', record);

    const formattanggalRusak = record.createdAt ? dayjs(record.createdAt) : null;
    const formattanggalPerbaikan = record.createdAt ? dayjs(record.createdAt) : null;

    form.setFieldsValue({
      id: record.id,
      jumlah: record.jumlah,
      jmlbarangrusak: record.jmlbarangrusak,
      perbaikan: record.perbaikan,
      tanggalRusak: formattanggalRusak,
      tanggalPerbaikan: formattanggalPerbaikan,
      keterangan: record.keterangan,
    });

    setId(record.id);
    setJumlah(record.jumlah);
    setJmlbarangrusak(record.jmlbarangrusak);
    setPerbaikan(record.perbaikan);
    settanggalRusak(record.tanggalRusak);
    settanggalPerbaikan(record.tanggalPerbaikan);
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
        console.log(record);
        return record.ruanganBarang.barang.nama;
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
      width: '10%',
      render: (record: Item) => {
        return (
          <span>
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation(); // Menghentikan penyebaran klik ke baris lain
                handleEdit(record); // Memanggil fungsi handleEdit saat tombol Edit diklik
              }}
              icon={<img src="/logoEdit.svg" style={{ width: '19px', height: '19px', marginLeft: '80px' }} />}
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
      <title>Barang Rusak</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Barang Rusak</h1>
      <Card style={{ marginTop: '100px', borderRadius: '30px' }}>
          <div ref={searchRef}>
            <Search
              placeholder="Telusuri Barang Rusak"
              className="custom-search"
              allowClear
              enterButton
              onSearch={handleSearch}
              style={{ width: 300, height: '40px', marginTop: '20px' }}
            />
          </div>
          <Button
            type="primary"
            onClick={handleButtonClick}
            icon={<PlusOutlined  style={{ marginTop: '7px', marginLeft: '20px' }}/>}
            style={{
              backgroundColor: 'white',
              boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
              color: 'black',
              marginRight: '20px',
              width: '200px',
              height: '40px',
              marginTop: '20px',
              display : 'flex',
              marginLeft : 'auto',
              bottom: '65px',
            }}
          >
            <span style={{ marginLeft: '10px', fontFamily, marginTop: '3px' }}>Barang Rusak</span>
          </Button>
        <Table
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={listBarangRusak?.data}
          onRow={(record) => ({
            onClick: () => handleRowClick(record.id),
            style: { cursor: 'pointer' },
          })}
          columns={mergedColumns as ColumnTypes}
          style={{ marginTop: '-10px' }}
        />
      </Card>
      <Modal
        visible={modalEditVisible}
        title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>Edit Barang Rusak</span>}
        style={{ textAlign: 'center' }}
        onCancel={handleModalCancel}
        centered
        width={900}
        footer={null}
      >
        <Form
          form={form}
          layout="horizontal"
          style={{ marginTop: '70px' }}
          onFinish={() => onFinishEdit(id)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <Form.Item
                name="jumlah"
                label="Jumlah"
                colon={false}
                labelAlign="left"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
                style={{ marginLeft: '20px',  }}
                rules={[{ required: true, message: 'Tolong isi jumlah!' }]}
              >
                <Input
                  placeholder="Jumlah"
                  style={{ width: '100%', height: '40px' }}
                  value={updateBarangrusak.jumlah}
                  disabled
                  onChange={(e) =>
                    setupdateBarangrusak({ ...updateBarangrusak, jumlah: Number(e.target.value) })
                  }
                />
              </Form.Item>
              <Form.Item
                name="jmlbarangrusak"
                label={
                  <span>
                    Jumlah barang
                    <br />
                    rusak
                  </span>
                }
                colon={false}
                labelAlign="left"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
                style={{ marginLeft: '20px' }}
                rules={[{ required: true, message: 'Tolong isi jumlah!' }]}
              >
                <Input
                  placeholder="Jumlah Barang Rusak"
                  style={{ width: '100%', height: '40px' }}
                  value={updateBarangrusak.jmlbarangrusak}
                  onChange={(e) =>
                    setupdateBarangrusak({
                      ...updateBarangrusak,
                      jmlbarangrusak: Number(e.target.value),
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                name="perbaikan"
                label={
                  <span>
                    Jumlah barang
                    <br />
                    perbaikan
                  </span>
                }
                colon={false}
                labelAlign="left"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
                style={{ marginLeft: '20px' }}
                rules={[{ required: true, message: 'Tolong isi jumlah!' }]}
              >
                <Input
                  placeholder="Jumlah Barang Perbaikan"
                  style={{ width: '100%', height: '40px' }}
                  value={updateBarangrusak.perbaikan}
                  onChange={(e) =>
                    setupdateBarangrusak({
                      ...updateBarangrusak,
                      perbaikan: Number(e.target.value),
                    })
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
                style={{ marginLeft: '20px' }}
                rules={[{ required: true, message: 'Tolong pilih tanggal Rusak!' }]}
              >
                <DatePicker
                  placeholder="Tanggal Rusak"
                  style={{ width: '100%', height: '40px' }}
                  disabled
                />
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <Form.Item
                name="tanggalPerbaikan"
                label={
                  <span>
                    Tanggal
                    <br />
                    perbaikan
                  </span>
                }
                colon={false}
                labelAlign="left"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 17 }}
                style={{ marginRight: '20px' }}
                rules={[{ required: true, message: 'Tolong pilih tanggal Perbaikan!' }]}
              >
                <DatePicker
                  placeholder="Tanggal Perbaikan"
                  style={{ width: '100%', height: '40px', marginLeft: '30px' }}
                  // value={
                  //   updateBarangrusak.tanggalRusak
                  //     ? dayjs(updateBarangrusak.tanggalRusak, 'YYYY-MM-DD').isValid()
                  //       ? dayjs(updateBarangrusak.tanggalRusak, 'YYYY-MM-DD')
                  //       : null
                  //     : null
                  // }
                  // onChange={handleDateChange}
                  // format="YYYY-MM-DD"
                />
              </Form.Item>
              <Form.Item
                name="keterangan"
                label="Keterangan"
                colon={false}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 17 }}
                style={{ marginRight: '20px' }}
                rules={[{ required: true, message: 'Tolong isi keterangan!' }]}
              >
                <TextArea
                  style={{ height: '170px', marginLeft: '30px' }}
                  value={updateBarangrusak.keterangan}
                  onChange={(e) =>
                    setupdateBarangrusak({ ...updateBarangrusak, keterangan: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item style={{ position: 'relative', display: 'flex' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: '90px',
                    backgroundColor: '#582DD2',
                    position: 'absolute',
                    left: '310px',
                  }}
                >
                  <span>Simpan</span>
                </Button>
                <Button
                  type="default"
                  onClick={handleModalCancel}
                  style={{
                    width: '90px',
                    position: 'absolute',
                    left: '210px',
                    borderColor: 'black',
                    color: 'black',
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
        visible={modalVisible}
        title={<span style={{ fontWeight: 'bold', fontSize: '20px' }}>Tambah Barang Rusak</span>}
        style={{ textAlign: 'center' }}
        centered
        width={900}
        footer={null}
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
                  style={{ width: '100%', height: '40px', textAlign: 'left', borderColor: 'black' }}
                >
                  {listBarang?.data?.map((barang: any) => (
                    <Option key={barang.id} value={barang.id}>
                      {barang.kode}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="barangRusak"
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
                  value={createbarangRusak.jumlah}
                  onChange={(e) =>
                    setcreatebarangRusak({ ...createbarangRusak, jumlah: Number(e.target.value) })
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
                wrapperCol={{ offset: 2, span: 16 }}
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
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                rules={[{ required: true, message: 'Tolong isi keterangan!' }]}
              >
                <TextArea
                  rows={4}
                  style={{ width: '100%', marginLeft: '35px' }}
                  value={createbarangRusak.keterangan}
                  onChange={(e) =>
                    setcreatebarangRusak({ ...createbarangRusak, keterangan: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item style={{ position: 'relative', display: 'flex' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: '90px',
                    backgroundColor: '#582DD2',
                    position: 'absolute',
                    left: '330px',
                  }}
                >
                  <span>Simpan</span>
                </Button>
                <Button
                  type="default"
                  onClick={handleModalCancel}
                  style={{
                    width: '90px',
                    position: 'absolute',
                    left: '230px',
                    borderColor: 'black',
                    color: 'black',
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
