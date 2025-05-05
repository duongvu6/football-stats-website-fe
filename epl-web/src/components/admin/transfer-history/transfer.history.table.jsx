
import { Table, Space } from "antd";
import EditTransferButton from "./edit.transfer.button.jsx";
import DeleteTransferButton from "./delete.transfer.button.jsx";

const TransferHistoryTable = ({ transferHistories, player, onSuccess, isAdmin = false }) => {

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const baseColumns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date) => formatDate(date)
        },
        {
            title: "Left",
            dataIndex: "previousClub",
            key: "previousClub",
            render: (club) => club || "-"
        },
        {
            title: "Joined",
            key: "club",
            render: (_, record) => {

                if (typeof record.club === 'object' && record.club) {
                    return record.club.name;
                }
                return record.club || "-";
            }
        },
        {
            title: "Transfer Type",
            dataIndex: "type",
            key: "type"
        },
        {
            title: "Market Value (millions Euro)",
            dataIndex: "playerValue",
            key: "playerValue"
        },
        {
            title: "Transfer Fee (millions Euro)",
            dataIndex: "fee",
            key: "transferFee"
        }
    ];

    const columns = isAdmin
        ? [
            ...baseColumns,
            {
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                    <Space size="small">
                        <EditTransferButton
                            player={player}
                            transfer={record}
                            onSuccess={onSuccess}
                        />
                        <DeleteTransferButton
                            player={player}
                            transfer={record}
                            onSuccess={onSuccess}
                        />
                    </Space>
                ),
            }
        ]
        : baseColumns;

    return (
        <Table
            columns={columns}
            dataSource={transferHistories}
            rowKey={(record) => record.id || record.date} // Use id if available, otherwise date
            pagination={false}
        />
    );
};

export default TransferHistoryTable;