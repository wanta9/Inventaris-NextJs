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
import { EditOutlined, PlusOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';
import { barangKeluarRepository } from '#/repository/barangkeluar';
import dayjs from 'dayjs';
import { akunRepository } from '#/repository/akun';
import { barangRepository } from '#/repository/barang';
import { ruanganRepository } from '#/repository/ruangan';
import { set } from 'mobx';
import { ruanganBarangRepository } from '#/repository/ruanganbarang';

const { Option } = Select;
const { Search } = Input;
const { Item } = Menu;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

interface updatebarangKeluar {
  id: string;
  jumlah: number;
  tanggalKeluar: string;
  keterangan: string;
}

interface createbarangKeluar {
  barangId: string;
  ruanganId: string;
  jumlah: number;
  tanggalKeluar: string;
  keterangan: string;
}

interface Item {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  harga: string;
  jumlah: string;
  tanggalKeluar: string;
  keterangan: string;
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
  handleEdit,
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
  const [id, setId] = useState<string>('');
  const [jumlah, setJumlah] = useState('');
  const [tanggalKeluar, settanggalKeluar] = useState('');
  const [keterangan, setketerangan] = useState('');
  const [form] = Form.useForm();
  const [createbarangKeluar, setcreatebarangKeluar] = useState<createbarangKeluar>({
    barangId: '',
    ruanganId: '',
    jumlah: 0,
    tanggalKeluar: '',
    keterangan: '',
  });
  const [updatebarangKeluar, setupdatebarangKeluar] = useState<updatebarangKeluar>({
    id: '',
    jumlah: 0,
    tanggalKeluar: '',
    keterangan: '',
  });
  const { data: listBarangKeluar, mutate: mutateBarangKeluar } =
    barangKeluarRepository.hooks.useBarangKeluar();
  console.log(listBarangKeluar, 'listBarangKeluar');
  const { data: listBarang, mutate: mutateBarang } = barangRepository.hooks.useBarang();
  const { data: listRuangan, mutate: mutateRuangan } = ruanganRepository.hooks.useRuangan();
  // const { data: listRuanganBarang } = ruanganBarangRepository.hooks.useRuanganBarangByRuanganId();
  const { data: akun } = akunRepository.hooks.useAuth();
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    setcreatebarangKeluar({ ...createbarangKeluar, tanggalKeluar: dateString });
    setupdatebarangKeluar({ ...updatebarangKeluar, tanggalKeluar: dateString });
  };

  // klik row
  const handleRowClick = (id: string) => {
    window.location.href = `http://localhost:3002/barangkeluar/${id}`;
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
    settanggalKeluar('');
    setketerangan('');
    form.resetFields();
    setEditData(null);
  };

  // CREATE BARANG KELUAR
  const onFinish = async (values: any) => {
    console.log('data values: ', values);
    try {
      setLoading(true);
      setError(null);
      const data = {
        barangId: values.barangId,
        ruanganId: values.ruanganId,
        jumlah: createbarangKeluar.jumlah,
        tanggalKeluar: createbarangKeluar.tanggalKeluar,
        keterangan: createbarangKeluar.keterangan,
      };
      const request = await barangKeluarRepository.api.barangKeluar(data);
      if (request.status === 400) {
        setError(request.body.message);
      } else {
        message.success('Data berhasil disimpan!');
        setModalVisible(false);
        await mutateBarangKeluar();
        await mutateBarang();
        await mutateRuangan();
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

  // EDIT BARANG KELUAR
  const onFinishEdit = async (id: string) => {
    console.log('id: ', id);
    try {
      setLoading(true);
      setError(null);
      const data = {
        jumlah: updatebarangKeluar.jumlah,
        tanggalKeluar: updatebarangKeluar.tanggalKeluar,
        keterangan: updatebarangKeluar.keterangan,
      };
      const request = await barangKeluarRepository.api.updatebarangKeluar(id, data);
      if (request.status === 400) {
        setError(request.body.message); // Set pesan error
      } else {
        message.success('berhasil Mengubah Barang Keluar!');
        setModalEditVisible(false);
        await mutateBarangKeluar();
        await mutateBarang();
        await mutateRuangan();
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Gagal Mengubah Barang Keluar');
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
    console.log(record, 'record data:');

    const formattedCreatedAt = record.createdAt ? dayjs(record.createdAt) : null;

    form.setFieldsValue({
      id: record.id,
      jumlah: record.jumlah,
      tanggalKeluar: formattedCreatedAt,
      keterangan: record.keterangan,
    });

    setId(record.id);
    setJumlah(record.jumlah);
    settanggalKeluar(record.tanggalKeluar);
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
        const namaBarang = record?.ruanganBarang?.barang?.nama;
        return namaBarang ? namaBarang : 'data belum ada';
      },
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah',
      editable: false,
    },
    {
      title: 'Tanggal Keluar',
      dataIndex: 'tanggalKeluar',
      editable: true,
      render: (text: string) => dayjs(text).format('DD-MM-YYYY'),
    },
    {
      title: '',
      dataIndex: '',
      width: '10%',
      render: (record: Item) => {
        return (
          <span>
            {role === 'admin' && (
              <Button
                type="link"
                onClick={(e) => {
                  e.stopPropagation(); // Menghentikan penyebaran klik ke baris lain
                  handleEdit(record); // Memanggil fungsi handleEdit saat tombol Edit diklik
                }}
                icon={
                  <img
                    src="/logoEdit.svg"
                    style={{ width: '19px', height: '19px', marginLeft: '80px' }}
                  />
                }
              />
            )}
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
      <title>Barang Keluar</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Barang Keluar</h1>
      <Card style={{ marginTop: '100px', borderRadius: '30px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginBottom: '16px',
            marginTop: '20px',
          }}
        >
          <div ref={searchRef}>
            <Search
              placeholder="Telusuri Barang Keluar"
              className="custom-search"
              allowClear
              enterButton
              onSearch={() => {}}
              style={{ width: 300, marginRight: '950px', height: '40px' }}
            />
          </div>
          {role === 'admin' && (
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
              <span style={{ marginRight: '20px', fontFamily }}>Barang Keluar</span>
            </Button>
          )}
        </div>
        <Table
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={listBarangKeluar?.data}
          pagination={{ pageSize: 5 }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record.id),
            style: { cursor: 'pointer' },
          })}
          columns={mergedColumns as ColumnTypes}
          style={{ marginTop: '50px' }}
        />
      </Card>
      <Modal
        title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>Tambah Barang Keluar</div>}
        visible={modalVisible}
        style={{ textAlign: 'center' }}
        onCancel={handleModalCancel}
        centered
        width={900}
        footer={null}
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
                <Input
                  placeholder="Jumlah"
                  style={{ width: '100%', height: '40px' }}
                  value={createbarangKeluar.jumlah}
                  onChange={(e) =>
                    setcreatebarangKeluar({ ...createbarangKeluar, jumlah: Number(e.target.value) })
                  }
                />
              </Form.Item>
              <Form.Item
                name="tanggalKeluar"
                label="Tanggal Keluar"
                colon={false}
                labelAlign="left"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
                rules={[{ required: true, message: 'Tolong pilih tanggal Keluar!' }]}
              >
                <DatePicker
                  placeholder="Tanggal Keluar"
                  style={{ width: '100%', height: '40px' }}
                  value={
                    createbarangKeluar.tanggalKeluar
                      ? dayjs(createbarangKeluar.tanggalKeluar, 'YYYY-MM-DD')
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
                <TextArea
                  rows={4}
                  style={{ width: '100%' }}
                  value={createbarangKeluar.keterangan}
                  onChange={(e) =>
                    setcreatebarangKeluar({ ...createbarangKeluar, keterangan: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                style={{ marginTop: '40px', marginBottom: '-5px' }}
                wrapperCol={{ offset: 15, span: 18 }}
              >
                <Button
                  type="default"
                  onClick={handleModalCancel}
                  style={{
                    color: 'black',
                    borderColor: 'black',
                    marginRight: '10px',
                  }}
                >
                  <span>Batal</span>
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: '#582DD2',
                  }}
                >
                  <span>Simpan</span>
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
        centered
        title={
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '20px' }}>
            Edit Barang Keluar
          </div>
        }
        style={{ textAlign: 'center' }}
        visible={modalEditVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} layout="horizontal" onFinish={() => onFinishEdit(id)}>
          <Form.Item
            name="jumlah"
            label="Jumlah"
            colon={false}
            labelAlign="left"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            rules={[{ required: true, message: 'Tolong isi jumlah!' }]}
            style={{ marginTop: '50px', marginLeft: '20px' }}
          >
            <Input
              placeholder="Jumlah"
              style={{ width: '100%', height: '40px' }}
              value={updatebarangKeluar.jumlah}
              onChange={(e) =>
                setupdatebarangKeluar({ ...updatebarangKeluar, jumlah: Number(e.target.value) })
              }
            />
          </Form.Item>
          <Form.Item
            name="tanggalKeluar"
            label="Tanggal Keluar"
            colon={false}
            labelAlign="left"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            rules={[{ required: true, message: 'Tolong pilih tanggal Keluar!' }]}
            style={{ marginLeft: '20px' }}
          >
            <DatePicker
              placeholder="Tanggal Keluar"
              style={{ width: '100%', height: '40px' }}
              value={
                updatebarangKeluar.tanggalKeluar
                  ? dayjs(updatebarangKeluar.tanggalKeluar, 'YYYY-MM-DD').isValid()
                    ? dayjs(updatebarangKeluar.tanggalKeluar, 'YYYY-MM-DD')
                    : null
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
              placeholder="Keterangan"
              rows={4}
              style={{ width: '100%', marginLeft: '20px' }}
              value={updatebarangKeluar.keterangan}
              onChange={(e) =>
                setupdatebarangKeluar({ ...updatebarangKeluar, keterangan: e.target.value })
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
