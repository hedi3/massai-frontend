import React, { useState, useEffect } from 'react';
import { Table, Spin, Button } from 'antd';
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import styled, {keyframes} from 'styled-components';
import {useNavigate} from "react-router-dom";

// Symbol to Name Mapping
const SYMBOL_NAME_MAP = {
    '^IXIC': 'nasdaq',
    // You can add more mappings here
    // Example:
    // '^GSPTSE': 'toronto',
    // '^DJI': 'dow-jones'
};

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
`;

const MainContainer = styled.div`
    min-height: 100vh;
    width: 100%;
    display: flex;
    margin-top: 70px;
    flex-direction: column;
    padding: 2rem;
    background: linear-gradient(135deg, #e1f5fe 0%, #ffebee 100%);
    animation: ${fadeIn} 1s ease-in-out;
`;

const Card = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    width: 100%;
    max-width: 1200px;
    overflow: hidden;
`;


const TradeOrdersPage = () => {
    const [tradeOrders, setTradeOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();


    const fetchAllTradeOrders = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8083/api/v1/orders/user/${user.username}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch trade orders');
            }

            const data = await response.json();
            setTradeOrders(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const closeTradeOrder = async (orderId) => {
        try {
            const response = await fetch(
                `http://localhost:8083/api/v1/orders/${orderId}/close`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to close trade order');
            }

            const updatedOrder = await response.json();
            toast.success('Trade order closed successfully');
            fetchAllTradeOrders(); // Refresh the trade orders list
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAllTradeOrders();
        }
    }, [user]);

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Styled components from the previous component can be reused
    const StatusBadge = styled.span`
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
    background: ${props => {
        switch (props.status) {
            case 'COMPLETED': return '#10B981';
            case 'PENDING': return '#F59E0B';
            case 'FAILED': return '#EF4444';
            case 'CANCELLED': return '#6B7280';
            default: return '#6B7280';
        }
    }};
  `;

    const ActionButton = styled.button`
    background-color: #3B82F6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #2563EB;
    }

    &:disabled {
        background-color: #9CA3AF;
        cursor: not-allowed;
    }
  `;

    const columns = [
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Lots Size',
            dataIndex: 'lotsSize',
            key: 'lotsSize',
        },
        {
            title: 'Original Price',
            key: 'originalPrice',
            render: (record) => formatAmount(record.originalPrice),
        },
        {
            title: 'Current Price',
            key: 'currentPrice',
            render: (record) =>
                record.status === 'ACTIVE' ? '------' : formatAmount(record.currentPrice),
        },
        {
            title: 'Status',
            key: 'performanceStatus',
            render: (record) =>
                record.status === 'ACTIVE' ? '------' : (
                    <StatusBadge status={record.performanceStatus}>
                        {record.performanceStatus}
                    </StatusBadge>
                ),
        },
        {
            title: 'Value',
            key: 'performanceValue',
            render: (record) =>
                record.status === 'ACTIVE' ? '------' : formatAmount(record.performanceValue),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record) => (
                <ActionButton
                    onClick={() => {
                        // Get the name based on the symbol, default to symbol if not found
                        const name = SYMBOL_NAME_MAP[record.symbol] || record.symbol;
                        navigate(`/${name}`); // Navigate to the corresponding page
                    }}
                    disabled={record.status === 'COMPLETED'}
                >
                    View Details
                </ActionButton>
            ),
        },
    ];

    return (
        <MainContainer>
            <Card>
        <div style={{ padding: '20px' }}>
            <h1>All Trade Orders</h1>
            {isLoading ? (
                <Spin size="large" />
            ) : (
                <Table
                    columns={columns}
                    dataSource={tradeOrders}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true
                    }}
                />
            )}
        </div>
            </Card>
        </MainContainer>
    );
};

export default TradeOrdersPage;