import {Table} from "antd";

const TransferHistoryTable = ({transferColumns, transferHistories}) => {
    return (
        <>
            <Table
                columns={transferColumns}
                dataSource={transferHistories}
                rowKey="date"
                pagination={false}
            />
        </>
    )

}
export default TransferHistoryTable;