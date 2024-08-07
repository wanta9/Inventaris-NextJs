'use client';

import React, { useContext, useState, useRef, useEffect } from 'react';
import { Button, Form, Input, Modal, Table, message, Row, Col, Card, Menu, Dropdown } from 'antd';
import { PlusOutlined, EditOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import type { FormInstance } from 'antd';
import { ruanganRepository } from '#/repository/ruangan';
import { useRouter } from 'next/navigation';
import { akunRepository } from '#/repository/akun';

const { Item } = Menu;

const EditableContext = React.createContext<FormInstance<any> | null>(null);
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;
type EditableTableProps = Parameters<typeof Table>[0];

interface updateLetakbarang {
  id: string;
  Letak_Barang: string;
}

interface createLetakbarang {
  Letak_Barang: string;
}

interface Item {  
  id: string;
  Letak_Barang: string;
}
interface DataType {
  id: string;
  Letak_Barang: string;
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
  dataIndex: keyof DataType;
  record: DataType;
  handleSave: (record: DataType) => void;
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
    form.setFieldsValue({ [dataIndex]: record[dataIndex].toUpperCase() });
  };

  useEffect(() => {
    // Focus the input field when it becomes editable
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);


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
        <Input ref={inputRef}/>
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const Page: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [count, setCount] = useState(0);
  const [form] = Form.useForm();
  const [id, setId] = useState<string>('');
  const [Letak_Barang, setLetak_Barang] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [editData, setEditData] = useState<DataType | null>(null);
  const { data: listRuangan, mutate: mutateListRuangan } = ruanganRepository.hooks.useRuangan();
  const { data: akun } = akunRepository.hooks.useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createLetakbarang, setcreateLetakbarang] = useState<createLetakbarang>({
    Letak_Barang: '',
  });
  const [updateLetakbarang, setupdateLetakbarang] = useState<updateLetakbarang>({
    id: '',
    Letak_Barang: '',
  });

  const onFinish = async (values: any) => {
    console.log('data values: ', values);
    try {
      setLoading(true);
      setError(null); 
      const data = {
        Letak_Barang: createLetakbarang.Letak_Barang.toUpperCase(),
      };
      const request = await ruanganRepository.api.ruangan(data);
      if (request.status === 400) { 
        setError(request.body.message); // Set pesan error
      } else {
        message.success('berhasil Menambahkan Letak Barang!');
        setModalVisible(false);
        await mutateListRuangan(); // Mutate after success
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Gagal Menambahkan Letak Barang.');
      console.log();
    } finally {
      setLoading(false);
    }
  };
  const onFinishEdit = async (id: string) => {
    console.log('id: ', id);
    try {
      setLoading(true);
      setError(null);
      const upperCaseLetak_Barang = updateLetakbarang.Letak_Barang.toUpperCase();
      const data = {
        Letak_Barang: upperCaseLetak_Barang,
      };
      const request = await ruanganRepository.api.updateRuangan(id, data);
      if (request.status === 400) { 
        setError(request.body.message); // Set error message
      } else {
        message.success('Berhasil Mengedit Letak Barang!');
        setModalEditVisible(false);
        await mutateListRuangan(); // Refresh data after success
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Gagal Mengedit Letak Barang.');
    } finally {
      setLoading(false);
    }
  };
  

  const router = useRouter();

  const role = akun?.data?.peran?.Role;

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

  // handle Edit
  const handleEdit = (record: Item) => {
    setId(record.id);
    const upperCaseLetak_Barang = record.Letak_Barang.toUpperCase(); // Convert to uppercase
    setupdateLetakbarang({ id: record.id, Letak_Barang: upperCaseLetak_Barang });
    form.setFieldsValue({ Letak_Barang: upperCaseLetak_Barang }); // Use uppercase value
    setModalEditVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setModalEditVisible(false);
    form.resetFields();
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Letak Barang',
      dataIndex: 'Letak_Barang',
      width: '80%',
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
              onClick={() => handleEdit(record)}
              icon={ <img src="/logoEdit.svg" style={{ width: '18px', height: '18px', marginLeft: '22px' }}/>}
            />
          </span>
        );
      },
    },
  ];

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

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

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <div>
      <title>Letak Barang</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Letak Barang</h1>
      <Card style={{ width: '30%', marginTop: '100px' }}>
        <>
          {role === 'admin' && (
            <Button
              type="primary"
              onClick={() => setModalVisible(true)}
              icon={<PlusOutlined style={{ marginTop: '8px', marginLeft: '20px' }} />}
              style={{
                width: '200px',
                height: '40px',
                marginBottom: '16px',
                backgroundColor: 'white',
                color: 'black',
                display: 'flex',
                marginLeft: 'auto',
                right: '20px',
                boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <span style={{ marginTop: '4px', marginLeft: '5px' }}>Letak Barang</span>
            </Button>
          )}
        </>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={listRuangan?.data}
          pagination={{ pageSize: 5 }}
          columns={columns as ColumnTypes}
          style={{ marginTop: '40px', width: '90%', marginLeft: '14px' }}
        />
        <Modal
          title="Tambah Letak Barang"
          style={{ textAlign: 'center'}}
          visible={modalVisible}
          centered
          onCancel={handleModalCancel}
          footer={false}
        >
          <Form form={form} layout="horizontal" onFinish={() => onFinish(id)}>
            <Form.Item label="Nama Ruangan" style={{ marginTop: '50px' }} colon={false} labelCol={{ span: 7 }} wrapperCol={{ span: 16  }}>
              <Input
                value={createLetakbarang.Letak_Barang}
                onChange={(e) =>
                  setcreateLetakbarang({ ...createLetakbarang, Letak_Barang: e.target.value })
                }
                placeholder="Masukkan letak barang"
                className="uppercase-input"
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{ display: 'relative'}}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: '#582DD2',
                    display: 'absolute',
                    top: '10px',
                    right: '-125px',
                  }}
                >
                  <span>Simpan</span>
                </Button>
                <Button
                  type="default"
                  onClick={handleModalCancel}
                  style={{
                    display: 'absolute',
                    left: '-25px',
                    top: '10px',
                    borderColor: 'black',
                    color: 'black',
                  }}
                >
                  <span>Batal</span>
                </Button>
              </Form.Item>
          </Form>
        </Modal>

    {/* Modal Edit */}
        <Modal
          title="Edit Letak Barang"
          style={{ textAlign: 'center' }}
          visible={modalEditVisible}
          centered
          onCancel={handleModalCancel}
          footer={null}
        >
          <Form 
          form={form}
          layout="horizontal" 
          onFinish={() => onFinishEdit(id)}

          >
            <Form.Item label="Nama Ruangan" style={{ marginTop: '50px' }} colon={false} labelCol={{ span: 7 }} wrapperCol={{ span: 16  }}>
              <Input
                placeholder="Masukkan letak barang"
                className="uppercase-input"
                value={updateLetakbarang.Letak_Barang}
                onChange={(e) =>
                  setupdateLetakbarang({ ...updateLetakbarang, Letak_Barang: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{ display: 'relative'}}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: '#582DD2',
                    display: 'absolute',
                    top: '10px',
                    right: '-125px',
                  }}
                >
                  <span>Simpan</span>
                </Button>
                <Button
                  type="default"
                  onClick={handleModalCancel}
                  style={{
                    display: 'absolute',
                    left: '-25px',
                    top: '10px',
                    borderColor: 'black',
                    color: 'black',
                  }}
                >
                  <span>Batal</span>
                </Button>
              </Form.Item>
          </Form>
        </Modal>
      </Card>
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
