import React from "react";
import { Modal, Form, Row, Col, DatePicker, TimePicker, Input, Button } from "antd";
import { CarOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import type { Dayjs } from "dayjs";
import type { FormInstance } from "antd/es/form";
import type { TCar } from "@/types/global";

export interface IBookingValues {
    pickupDate: Dayjs;
    returnDate: Dayjs;
    pickupTime: Dayjs;
    returnTime: Dayjs;

}

type Props = {
    selectedCar: TCar;
    open: boolean;
    bookingForm: FormInstance<any>;
    onCancel: () => void;
    onSubmit: (values: IBookingValues) => void;
    isLoading?: boolean;
};

const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } }
};

const BookingModal: React.FC<Props> = ({ selectedCar, open, bookingForm, onCancel, onSubmit, isLoading }) => {
    return (
        <Modal
            title={
                <div className="flex items-center">
                    <CarOutlined className="mr-2 text-[#4234a3]" />
                    <span className="text-lg font-semibold">Book {selectedCar?.name}</span>
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={null}
            width={500}
            centered
            styles={{ body: { padding: '24px' }, header: { borderBottom: '1px solid rgba(66, 52, 163, 0.1)', padding: '16px 24px' } }}
        >
            <motion.div variants={modalVariants} initial="hidden" animate="visible" className="pt-4">
                <div className="flex items-center gap-4 mb-6 p-3 rounded-lg" style={{ background: 'rgba(66, 52, 163, 0.05)', border: '1px solid rgba(66, 52, 163, 0.1)' }}>
                    <img src={selectedCar.image} alt={selectedCar.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                        <h4 className="font-bold text-gray-900">{selectedCar.name}</h4>
                        <p className="text-[#4234a3] font-bold">${selectedCar.pricePerHour}<span className="text-sm font-normal text-gray-600 ml-1">/hour</span></p>
                    </div>
                </div>

                <Form form={bookingForm} layout="vertical" onFinish={onSubmit}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Pickup Date" name="pickupDate" rules={[{ required: true, message: 'Please select pickup date' }]}>
                                <DatePicker className="w-full rounded-lg" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Return Date" name="returnDate" rules={[{ required: true, message: 'Please select return date' }]}>
                                <DatePicker className="w-full rounded-lg" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Pickup Time" name="pickupTime" rules={[{ required: true, message: 'Please select pickup time' }]}>
                                <TimePicker className="w-full rounded-lg" format="HH:mm" minuteStep={15} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Return Time" name="returnTime" rules={[{ required: true, message: 'Please select return time' }]}>
                                <TimePicker className="w-full rounded-lg" format="HH:mm" minuteStep={15} />
                            </Form.Item>
                        </Col>
                    </Row>



                    <div className="mt-6 flex justify-end gap-3">
                        <Button onClick={onCancel} className="rounded-lg">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={isLoading} className="rounded-lg shadow-lg" style={{ background: 'linear-gradient(135deg, #4234a3, #5a4ac9)', border: 'none' }}>Confirm Booking</Button>
                    </div>
                </Form>
            </motion.div>
        </Modal>
    );
};

export default BookingModal;
