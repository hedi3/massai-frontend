import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styled, { keyframes } from 'styled-components';

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

const LoadingContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-size: 1.125rem;
`;

const ErrorContainer = styled(LoadingContainer)`
    color: #ef4444;
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

const CardHeader = styled.div`
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
`;

const Title = styled.h1`
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin: 0;
`;

const Subtitle = styled.p`
    color: #666;
    margin: 0.5rem 0 0 0;
`;

const TableContainer = styled.div`
    overflow-x: auto;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const TableHeader = styled.th`
    padding: 1rem;
    text-align: ${props => props.align || 'left'};
    background: #f8f9fa;
    cursor: pointer;
    user-select: none;
    color: #555;
    font-weight: 600;
    transition: background-color 0.2s;

    &:hover {
        background: #edf2f7;
    }
`;

const TableRow = styled.tr`
    border-bottom: 1px solid #eee;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: #f8f9fa;
    }
`;

const TableCell = styled.td`
    padding: 1rem;
    text-align: ${props => props.align || 'left'};
    color: #333;
`;

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

const HeaderCell = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: ${props => props.align === 'right' ? 'flex-end' : 'flex-start'};
`;

const SortArrow = styled.span`
    font-size: 0.875rem;
    margin-left: 4px;
`;

const TransactionType = styled.span`
    color: ${props => props.type === 'DEPOSIT' ? '#10B981' : '#EF4444'};
    font-weight: 500;
`;

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortColumn, setSortColumn] = useState('timestamp');
    const [sortDirection, setSortDirection] = useState('desc');
    const { user } = useAuth();

    useEffect(() => {
        if (user?.username) {
            fetchTransactions();
        }
    }, [user?.username]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8083/api/transactions/user/${user.username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setTransactions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }

        const sortedTransactions = [...transactions].sort((a, b) => {
            let comparison = 0;
            switch (column) {
                case 'timestamp':
                    comparison = new Date(a.timestamp) - new Date(b.timestamp);
                    break;
                case 'amount':
                    comparison = a.amount - b.amount;
                    break;
                case 'type':
                case 'status':
                    comparison = a[column].localeCompare(b[column]);
                    break;
                default:
                    comparison = 0;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        setTransactions(sortedTransactions);
    };

    const getSortIcon = (column) => {
        if (sortColumn !== column) return '↕';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    if (loading) {
        return <LoadingContainer>Loading transactions...</LoadingContainer>;
    }

    if (error) {
        return <ErrorContainer>Error: {error}</ErrorContainer>;
    }

    return (
        <MainContainer>
            <Card>
                <CardHeader>
                    <Title>Transaction History</Title>
                    <Subtitle>View and manage your transaction history</Subtitle>
                </CardHeader>
                <TableContainer>
                    <Table>
                        <thead>
                        <tr>
                            <TableHeader onClick={() => handleSort('timestamp')}>
                                <HeaderCell>
                                    Date/Time
                                    <SortArrow>{getSortIcon('timestamp')}</SortArrow>
                                </HeaderCell>
                            </TableHeader>
                            <TableHeader onClick={() => handleSort('type')}>
                                <HeaderCell>
                                    Type
                                    <SortArrow>{getSortIcon('type')}</SortArrow>
                                </HeaderCell>
                            </TableHeader>
                            <TableHeader align="right" onClick={() => handleSort('amount')}>
                                <HeaderCell align="right">
                                    Amount
                                    <SortArrow>{getSortIcon('amount')}</SortArrow>
                                </HeaderCell>
                            </TableHeader>
                            <TableHeader onClick={() => handleSort('status')}>
                                <HeaderCell>
                                    Status
                                    <SortArrow>{getSortIcon('status')}</SortArrow>
                                </HeaderCell>
                            </TableHeader>
                            <TableHeader>Reference</TableHeader>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map(transaction => (
                            <TableRow key={transaction.id}>
                                <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                                <TableCell>
                                    <TransactionType type={transaction.type}>
                                        {transaction.type}
                                    </TransactionType>
                                </TableCell>
                                <TableCell align="right">{formatAmount(transaction.amount)}</TableCell>
                                <TableCell>
                                    <StatusBadge status={transaction.status}>
                                        {transaction.status}
                                    </StatusBadge>
                                </TableCell>
                                <TableCell>{transaction.reference}</TableCell>
                            </TableRow>
                        ))}
                        </tbody>
                    </Table>
                </TableContainer>
            </Card>
        </MainContainer>
    );
};

export default TransactionsPage;