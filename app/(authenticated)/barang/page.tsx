'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Avatar, Button, Card, Col, Form, Input, InputRef, Modal, Popconfirm, Row, Table, message, Dropdown } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined, EditOutlined, DownOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { FormInstance } from 'antd/lib';

const { Search } = Input;
const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface DataType {
  key: string;
  namapeminjam: string;
  telpon: string;
  kodepeminjam: string;
  tanggalpeminjaman: string;
  tanggaldikembalikan: string;
  status: string;
  foto: string;
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
  children: React.ReactNode;
  dataIndex: keyof DataType;
  record: DataType;
  handleSave: (record: DataType) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
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

const Peminjaman: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredData = dataSource.filter(
    item =>
      item.namapeminjam.toLowerCase().includes(searchText.toLowerCase()) ||
      item.telpon.toLowerCase().includes(searchText.toLowerCase()) ||
      item.kodepeminjam.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    // Fetch and set initial data here
    const initialData: DataType[] = [
      // Example data
      {
        key: '1',
        namapeminjam: 'John Doe',
        telpon: '123456789',
        kodepeminjam: '001',
        tanggalpeminjaman: '2024-06-01',
        tanggaldikembalikan: '2024-06-10',
        status: 'Dipinjam',
        foto: 'https://via.placeholder.com/150',
      },
    ];
    setDataSource(initialData);
  }, []);

  const isEditing = (record: DataType) => {
    if (!record) {
      return false;
    }
    return record.key === editingKey;
  };
  

  const handleEdit = (record: DataType) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const handleSave = async (key: string) => {
    try {
      const row = (await form.validateFields()) as DataType;
      const newData = [...dataSource];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
        setEditingKey(null);
      } else {
        newData.push(row);
        setDataSource(newData);
        setEditingKey(null);
      }
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const handleDelete = (key: string) => {
    const newData = dataSource.filter(item => item.key !== key);
    setDataSource(newData);
  };

  const columns = [
    {
      title: 'Nama Peminjam',
      dataIndex: 'namapeminjam',
      editable: true,
      render: (text: string, record: DataType) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={record.foto} />
          <span style={{ marginLeft: 8 }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Telepon',
      dataIndex: 'telpon',
      editable: true,
    },
    {
      title: 'Kode Peminjam',
      dataIndex: 'kodepeminjam',
      editable: true,
    },
    {
      title: 'Tanggal Peminjaman',
      dataIndex: 'tanggalpeminjaman',
      editable: true,
    },
    {
      title: 'Tanggal Dikembalikan',
      dataIndex: 'tanggaldikembalikan',
      editable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      editable: true,
      render: (status: string, record: DataType) => (
        <Button type="primary" style={{ width: '70%' }} onClick={(e) => {
          e.stopPropagation();
          handleEdit(record);
        }}>
          {status}
        </Button>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (record: DataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button onClick={() => handleSave(record.key)}>Save</Button>
            <Popconfirm title="Cancel?" onConfirm={() => setEditingKey(null)}>
              <Button>Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Button type="link" onClick={() => handleEdit(record)} icon={<EditOutlined />} />
            <Popconfirm title="Delete?" onConfirm={() => handleDelete(record.key)}>
              <Button type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <div>
      <div>
        <title>Peminjaman</title>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Peminjaman</h1>
      </div>
      <Card style={{ marginTop: '100px' }}>
        <div style={{ marginTop: '20px' }}>
          <Search
            placeholder="Cari nama, nama pengguna, atau NISN"
            allowClear
            onSearch={handleSearch}
            prefix={<SearchOutlined style={{ marginRight: 8 }} />}
            style={{ width: 300 }}
          />
          <Table
            components={{
              body: {
                row: EditableRow,
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={filteredData}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{ onChange: () => setEditingKey(null) }}
          />
          <Button type="primary" onClick={() => setModalVisible(true)} icon={<PlusOutlined />} style={{ marginTop: '16px' }}>
            Tambah Peminjam
          </Button>
          <Modal
            title="Tambah Peminjam"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onOk={() => {
              form.validateFields().then(values => {
                form.resetFields();
                setDataSource([...dataSource, { ...values, key: dataSource.length.toString() }]);
                setModalVisible(false);
              }).catch(info => {
                console.log('Validate Failed:', info);
              });
            }}
          >
            <Form form={form} layout="vertical" name="form_in_modal">
              <Form.Item name="namapeminjam" label="Nama Peminjam" rules={[{ required: true, message: 'Please input the name of the borrower!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="telpon" label="Telepon" rules={[{ required: true, message: 'Please input the phone number!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="kodepeminjam" label="Kode Peminjam" rules={[{ required: true, message: 'Please input the borrower code!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="tanggalpeminjaman" label="Tanggal Peminjaman" rules={[{ required: true, message: 'Please input the borrowing date!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="tanggaldikembalikan" label="Tanggal Dikembalikan" rules={[{ required: true, message: 'Please input the return date!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please input the status!' }]}>
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Card>
    </div>
  );
};

export default Peminjaman;
