// src/pages/avs/[id].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { GetCombinedOperatorsData } from '../../services/eigenlayer';
import 'bootstrap/dist/css/bootstrap.min.css';

const AVSDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [operatorData, setOperatorData] = useState([]);
  const [avsName, setAvsName] = useState('');
  const [batchStart, setBatchStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOperatorsData(id);
    }
  }, [id]);

  const fetchOperatorsData = async (avsAddress) => {
    try {
      setLoading(true);
      const { combinedData, hasMore, avsName } = await GetCombinedOperatorsData(avsAddress, batchStart, 10);
      setOperatorData(prevData => [...prevData, ...combinedData]);
      setBatchStart(prevStart => prevStart + 10);
      setHasMore(hasMore);
      setAvsName(avsName);
    } catch (error) {
      console.error('Error fetching operators data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    fetchOperatorsData(id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const formatNumber = (number, format) => {
    return new Intl.NumberFormat('en-US', format).format(number);
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <h1 className="my-4">Operators for AVS {avsName}</h1>
          <div className="table-responsive">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Operator Logo</th>
                  <th>Operator Name</th>
                  <th>Operator Website</th>
                  <th>Operator Twitter</th>
                  <th>Registered Time</th>
                  <th>Total TVL</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Current # of Stakers</th>
                </tr>
              </thead>
              <tbody>
                {operatorData.map((operator, index) => (
                  <tr key={index}>
                    <td><img src={operator.logo} alt={`${operator.operator_name} logo`} style={{ width: '50px' }} /></td>
                    <td>{operator.operator_name}</td>
                    <td><a href={operator.website} target="_blank" rel="noopener noreferrer">Website</a></td>
                    <td><a href={operator.twitter} target="_blank" rel="noopener noreferrer">Twitter</a></td>
                    <td>{formatDate(operator.registered_time)}</td>
                    <td>{formatNumber(operator.total_TVL, { style: 'decimal', maximumFractionDigits: 2 })}</td>
                    <td>{formatNumber(operator.num_stakers, { style: 'decimal', maximumFractionDigits: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {hasMore && (
            <div className="text-center mt-4">
              <Button onClick={loadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AVSDetail;
