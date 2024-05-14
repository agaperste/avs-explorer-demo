import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Table, Container, Row, Col, Button } from 'react-bootstrap';
import { GetCombinedAVSData } from '../services/eigenlayer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const HomePage = ({ initialData, initialOffset }) => {
  const router = useRouter();
  const [avsList, setAvsList] = useState(initialData || []);
  const [offset, setOffset] = useState(initialOffset || 0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = async () => {
    setLoading(true);
    try {
      const { combinedData, nextOffset } = await GetCombinedAVSData(8, offset);
      setAvsList([...avsList, ...combinedData]);
      if (nextOffset !== undefined && nextOffset !== null) {
        setOffset(nextOffset);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching more data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNumOperatorsClick = (avs) => {
    router.push(`/avs/${avs.avs_contract_address}`);
  };

  const formatNumber = (number, format) => {
    return new Intl.NumberFormat('en-US', format).format(number);
  };

  return (
    <div className="page-container">
      <Container fluid>
        <Row>
          <Col md={12}>
            <h1 className="text-center my-4">AVS Explorer</h1>
            <p className="text-center mb-4">
              Welcome to the AVS Explorer, your one-stop destination to explore actively validated services. Discover detailed information about various services, their descriptions, and how to connect with them.
            </p>
            <div className="table-responsive">
              <Table striped bordered hover responsive className="avs-table">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Twitter</th>
                    <th>Website</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Current # of Operators</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Total TVL</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Current # of Stakers</th>
                  </tr>
                </thead>
                <tbody>
                  {avsList.map(avs => (
                    <tr key={avs.avs_contract_address}>
                      <td><img src={avs.logo} alt={`${avs.avs_name} logo`} style={{ width: '50px' }} /></td>
                      <td>{avs.avs_name}</td>
                      <td>{avs.description}</td>
                      <td><a href={avs.twitter} target="_blank" rel="noopener noreferrer">Twitter</a></td>
                      <td><a href={avs.website} target="_blank" rel="noopener noreferrer">Website</a></td>
                      <td
                        className="clickable-cell"
                        onClick={() => handleNumOperatorsClick(avs)}
                      >
                        {avs.num_operators}
                      </td>
                      <td>{formatNumber(avs.total_TVL, { style: 'decimal', maximumFractionDigits: 2 })}</td>
                      <td>{formatNumber(avs.num_stakers, { style: 'decimal', maximumFractionDigits: 0 })}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {hasMore && (
              <div className="text-center mt-4">
                <Button onClick={fetchMoreData} disabled={loading}>
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export async function getStaticProps() {
  try {
    const { combinedData, nextOffset } = await GetCombinedAVSData(8, 0);
    return { props: { initialData: combinedData, initialOffset: nextOffset || null } };
  } catch (error) {
    console.error('Error fetching AVS data:', error);
    return { props: { initialData: [], initialOffset: 0 } };
  }
}

export default HomePage;
