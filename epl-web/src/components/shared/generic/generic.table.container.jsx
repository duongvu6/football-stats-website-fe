// epl-web/src/components/shared/generic/generic.table.container.jsx
import { Button, Table } from "antd";
import { PlusOutlined } from '@ant-design/icons';

const GenericTableContainer = ({
                                   tableProps,
                                   title,
                                   showAddButton = false,
                                   onAddClick,
                                   addButtonText = 'Add'
                               }) => {
    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: showAddButton ? "space-between" : "center",
                alignItems: "center",
                marginTop: "10px",
                marginBottom: "10px"
            }}>
                <h3>{title}</h3>
                {showAddButton && (
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onAddClick}
                    >
                        {addButtonText}
                    </Button>
                )}
            </div>
            <Table {...tableProps} />
        </>
    );
};

export default GenericTableContainer;