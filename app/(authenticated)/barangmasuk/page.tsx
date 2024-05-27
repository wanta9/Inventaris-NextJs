"use client";

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Card, Form, Input, InputRef, Modal, message, Table } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';

const { Search } = Input;

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
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [editData, setEditData] = useState<Item | null>(null);
  const [count, setCount] = useState(0);
  const [form] = Form.useForm();

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredData = dataSource.filter(item =>
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
      editable: false, // saya disable
    },
    {
      title: 'Nama Barang',
      dataIndex: 'namaBarang',
      editable: true,
    },
    {
      title: 'Harga',
      dataIndex: 'harga',
      editable: true,
      render: (text: string) => `Rp ${text}`,
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah',
      editable: true,
    },
    {
      title: 'Tanggal Masuk',
      dataIndex: 'tanggalMasuk',
      editable: true,
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
      <title>Barang Masuk</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Barang Masuk</h1>
      <Card>
        <Search
          placeholder="Telusuri Barang"
          allowClear
          enterButton
          onSearch={value => handleSearch(value)}
          style={{ width: 300}}
        />
        <Button type="primary" onClick={handleButtonClick} icon={<PlusOutlined/>} style={{marginLeft: 'auto', display: 'flex', bottom: '25px', right:'20px', backgroundColor: 'white',boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)', color: 'black'}}>
          Tambah Barang
        </Button>
        <Table
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={filteredData}
          columns={mergedColumns as ColumnTypes}
          style={{ marginTop: '30px' }}
        />
      </Card>
      <Modal
        visible={modalVisible || modalEditVisible}
        title={editData ? "Edit Barang" : "Tambah Barang"}
        style={{ textAlign: 'center'}}
        onCancel={handleModalCancel}
        okText="Simpan"
        okButtonProps={{ style: { background: '#582DD2' } }}
        cancelText="Batal"
        cancelButtonProps={{ style: { borderColor: 'black' } }}
        onOk={handleSaveModalData}
      >
        <Form form={form} layout="vertical">
          {editData ? (
            <Form.Item
              name="kodeBarang"
              label="Kode Barang"
              rules={[{ required: true, message: 'Tolong isi kode barang!' }]}
            >
              <Input disabled />
            </Form.Item>
          ) : null}
          <Form.Item
            name="namaBarang"
            label="Nama Barang"
            rules={[{ required: true, message: 'Tolong isi nama barang!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="harga"
            label="Harga"
            rules={[{ required: true, message: 'Tolong isi harga!' }]}
          >
            <Input prefix="Rp"/>
          </Form.Item>
          <Form.Item
            name="jumlah"
            label="Jumlah"
            rules={[{ required: true, message: 'Tolong isi jumlah!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Page;
