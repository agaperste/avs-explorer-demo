// src/pages/index.js
import React, { useState } from 'react';
import { Table, Container, Row, Col, Button } from 'react-bootstrap';
import { GetCombinedAVSData } from '../services/eigenlayer';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = ({ initialData, initialOffset }) => {
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

  const [expandedRows, setExpandedRows] = useState([]);

  const handleRowClick = (id) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(id)
        ? prevExpandedRows.filter(rowId => rowId !== id)
        : [...prevExpandedRows, id]
    );
  };

  const renderDescription = (description, id) => {
    const isExpanded = expandedRows.includes(id);
    return (
      <td onClick={() => handleRowClick(id)} style={{ cursor: 'pointer' }}>
        {isExpanded ? description : `${description.slice(0, 100)} `}
        {!isExpanded && (
          <span className="text-primary" style={{ textDecoration: 'underline', color: 'blue' }}>
            ...
          </span>
        )}
      </td>
    );
  };

  return (
    <div className="page-container">
      <Container>
        <Row className="justify-content-center">
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
                    <th>Num Operators</th>
                    <th>Total TVL</th>
                    <th>Num Stakers</th>
                  </tr>
                </thead>
                <tbody>
                  {avsList.map(avs => (
                    <tr key={avs.avs_contract_address}>
                      <td><img src={avs.logo} alt={`${avs.avs_name} logo`} style={{ width: '50px' }} /></td>
                      <td>{avs.avs_name}</td>
                      {renderDescription(avs.description, avs.avs_contract_address)}
                      <td><a href={avs.twitter} target="_blank" rel="noopener noreferrer">Twitter</a></td>
                      <td><a href={avs.website} target="_blank" rel="noopener noreferrer">Website</a></td>
                      <td>{avs.num_operators}</td>
                      <td>{avs.total_TVL}</td>
                      <td>{avs.num_stakers}</td>
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
