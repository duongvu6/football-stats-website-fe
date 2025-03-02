// epl-web/src/components/admin/transfer-history/transfer.history.table.jsx
import { Table, Space } from "antd";
import EditTransferButton from "./edit.transfer.button.jsx";
import DeleteTransferButton from "./delete.transfer.button.jsx";

const TransferHistoryTable = ({ transferColumns, transferHistories, player, onSuccess, isAdmin = false }) => {
    // Add actions column for admin view
    const columns = isAdmin
        ? [
            ...transferColumns,
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
        : transferColumns;

    return (
        <Table
            columns={columns}
            dataSource={transferHistories}
            rowKey="date"
            pagination={false}
        />
    );
};

export default TransferHistoryTable;