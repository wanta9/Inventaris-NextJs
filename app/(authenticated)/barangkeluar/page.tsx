"use client";

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Card, Form, Input, InputRef, Modal, message, Table, Select, DatePicker, Dropdown, Image, Menu } from 'antd';
import { EditOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import TextArea from 'antd/es/input/TextArea';

const { Option } = Select;
const { Search } = Input;
const { Item } = Menu;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

interface Item {
  key: string;
  kodeBarang: string;
  namaBarang: string;
  harga: string;
  jumlah: string;
  tanggalMasuk: string;
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
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
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
  const [form] = Form.useForm();


  const menu = (
    <Menu>
      <Item key="2">
        <a style={{ color: 'red'}} target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        <ArrowLeftOutlined style={{ color: 'red', marginRight: '10px' }}/>Keluar
        </a>
      </Item>
    </Menu>
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredData = dataSource.filter(item =>
    item.kodeBarang.toLowerCase().includes(searchText.toLowerCase()) ||
    item.namaBarang.toLowerCase().includes(searchText.toLowerCase()) ||
    // item.harga.toLowerCase().includes(searchText.toLowerCase()) ||
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

  const handleSaveModalData = async () => {
    try {
      const values = await form.validateFields();
      const currentDate = new Date();
      if (editData) {
        const newData = dataSource.map(item => {
          if (item.key === editData.key) {
            return { ...item, ...values };
          }
          return item;
        });
        setDataSource(newData);
        setModalEditVisible(false);
        setEditData(null);
      } else {
        const newKodeBarang = `A${(count + 1).toString().padStart(4, '0')}`;
        const newData: Item = {
          key: count.toString(),
          kodeBarang: newKodeBarang,
          tanggalMasuk: currentDate.toISOString().slice(0,10),
          ...values,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
        setModalVisible(false);
      }
      form.resetFields();
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleSave = (row: Item) => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row });
      setDataSource(newData);
    }
  };

  const handleEdit = (record: Item) => {
    setEditData(record);
    form.setFieldsValue(record);
    setModalEditVisible(true);
  };

  const columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Kode Barang',
      dataIndex: 'kodeBarang',
      editable: false,
    },
    {
      title: 'Nama Barang',
      dataIndex: 'namaBarang',
      editable: false,
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
      render: (text: string) => text,
    },
    {
      title: '',
      dataIndex: '',
      render: (record: Item) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)} icon={<EditOutlined />} />
        </span>
      ),
    },
  ];
  
  const mergedColumns = columns.map(col => {
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
      <Card style={{ marginTop: '100px'}}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '16px' }}>
        <Search
          placeholder="Telusuri Barang"
          allowClear
          enterButton
          onSearch={value => handleSearch(value)}
          style={{ width: 300, marginRight: '90vh'}}
        />
        <Button type="primary" onClick={handleButtonClick} icon={<PlusOutlined style={{ marginTop: '4px', marginRight: '10px'}}/>} style={{ backgroundColor: 'white',boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)', color: 'black', marginRight: '20px', width:'200px', height: '40px'}}>
         <span style={{ marginRight: '20px', fontFamily}}>
          Barang Keluar
          </span>
        </Button>
        </div>
        <Table
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={filteredData}
          columns={mergedColumns as ColumnTypes}
          style={{ marginTop: '30px'}}
        />
      </Card>
      <Modal
      visible={modalVisible || modalEditVisible}
       title={editData ? <span style={{ fontWeight: 'bold' }}>Edit Barang Keluar</span> : <span style={{ fontWeight: 'bold' }}>Tambah Barang Keluar</span>}
      style={{ textAlign: 'center'}}
      onCancel={handleModalCancel}
      centered
      width={900}
      okText="Simpan"
      okButtonProps={{ style: { background: '#582DD2' } }}
      cancelText="Batal"
      cancelButtonProps={{ style: { borderColor: 'black', color: 'black' } }}
      onOk={handleSaveModalData}
    >
        <Form form={form} layout="horizontal" style={{ marginTop : '50px'}}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, marginRight: '16px' }}>
              <Form.Item
                name="kodeBarang"
                label="Kode Barang"
                style={{ textAlign: 'left'}}
                colon={false}
                labelAlign='left'
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
                rules={[{ required: true, message: 'Tolong isi kode barang!' }]}
              >
                <Select placeholder="Kode Barang" style={{ width: '100%', height: '40px' }}>
                  {dataSource.map(item => (
                    <Option key={item.key} value={item.kodeBarang}>
                      {`${item.kodeBarang} - ${item.namaBarang}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="jumlah"
                label="Jumlah"
                colon={false}
                labelAlign='left'
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
                rules={[{ required: true, message: 'Tolong isi jumlah!' }]}
              >
                <Input  placeholder= "Jumlah"style={{ width: '100%', height: '40px' }} />
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <Form.Item
                name="ruangan"
                label="Ruangan"
                colon={false}
                // Agar ke Kiri Teksnya
                labelAlign='left'
                // Atur Col
                labelCol={{ span: 5 }}
                // Atur lebar Input
                wrapperCol={{ span: 8 }}
                rules={[{ required: true, message: 'Tolong pilih ruangan!' }]}
              >
                <Select placeholder="Pilih Ruangan" style={{ width: '100%', height: '40px', textAlign: 'left'}}>
                  <Option value="ruangan1">TKJ</Option>
                  <Option value="ruangan2">RPL</Option>
                  {/* Tambahkan opsi ruangan lainnya sesuai kebutuhan */}
                </Select>
              </Form.Item>
              <Form.Item
                name="keterangan"
                label="Keterangan"
                colon={false}
                rules={[{ required: true, message: 'Tolong isi keterangan!' }]}
              >
                <TextArea rows={4} style={{ width: '100%' }} />
              </Form.Item>
            </div>
          </div>
        </Form>
    </Modal>
    <div style={{ position: 'absolute', top: '20px', right: '100px', display: 'flex', alignItems: 'center'}}>
              <Dropdown overlay={menu} placement="bottomCenter">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button style={{ width: '175px', height: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src="ikon.png" alt='Profile' style={{ width: '70px', marginRight: '5px', marginLeft: '-10px'}} />
                      <div>
                          <div style={{ fontSize: '12px', color: 'black', marginRight: '20px'}}>Halo, Elisabet</div>
                        <div  style={{ fontSize: '12px', color: 'grey ', marginRight: '47px'}}>Admin</div>
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