import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Descriptions, Spin, Table, Button, Space, Modal, Form, Input, DatePicker, Select, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchPlayerDetailAPI } from "../../../services/api.service.js";

const PlayerDetail = () => {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPlayerDetail();
    }, [id]);

    const loadPlayerDetail = async () => {
        setLoading(true);
        const res = await fetchPlayerDetailAPI(id);
        if (res.data) {
            setPlayer(res.data);
        }
        setLoading(false);
    };

    // Function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin />
            </div>
        );
    }

    // Process transfer history to add fromClub
    const transferHistories = [...player.transferHistories].map((transfer, index, array) => {
        // If it's the last item in the array (oldest transfer), fromClub is "-"
        // Otherwise, fromClub is the club of the next item (previous transfer chronologically)
        const fromClub = index === array.length - 1 ? "-" : array[index + 1].club;
        return {
            ...transfer,
            fromClub,
            formattedDate: formatDate(transfer.date)
        };
    });

    const transferColumns = [
        {
            title: "Date",
            dataIndex: "formattedDate", // Use the formatted date
            key: "date",
        },
        {
            title: "From Club",
            dataIndex: "fromClub",
            key: "fromClub",
        },
        {
            title: "To Club",
            dataIndex: "club",
            key: "club",
        },
        {
            title: "Type of transfer",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Market Value",
            dataIndex: "playerValue",
            key: "playerValue",
        },
        {
            title: "Transfer Fee",
            dataIndex: "fee",
            key: "transferFee",
        },
    ];

    return (
        <div style={{ padding: "30px" }}>
            <Descriptions title="Player Details" bordered>
                <Descriptions.Item label="ID">{player.id}</Descriptions.Item>
                <Descriptions.Item label="Name">{player.name}</Descriptions.Item>
                <Descriptions.Item label="Age">{player.age}</Descriptions.Item>
                <Descriptions.Item label="Shirt Number">{player.shirtNumber}</Descriptions.Item>
                <Descriptions.Item label="Citizenship">{player.citizenships.join(', ')}</Descriptions.Item>
                <Descriptions.Item label="Position">{player.positions.join(', ')}</Descriptions.Item>
                <Descriptions.Item label="Current Club">{player.transferHistories[0]?.club || "No information"}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0 }}>Transfer History</h3>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => message.info("Add Transfer functionality would go here")}
                    >
                        Add Transfer
                    </Button>
                </div>
                <Table
                    columns={transferColumns}
                    dataSource={transferHistories}
                    rowKey="date"
                    pagination={false}
                />
            </div>
        </div>
    );
};

export default PlayerDetail;