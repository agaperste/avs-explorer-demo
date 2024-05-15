import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Table, Container, Row, Col, Button } from 'react-bootstrap';
import { GetCombinedAVSData } from '../services/eigenlayer';
import Layout from '../app/layout'; // Import the Layout component
import 'bootstrap/dist/css/bootstrap.min.css';
import '.././app/globals.css';
import Image from 'next/image';

const HomePage = ({ initialData, initialNextUri }) => {
  const router = useRouter();
  const [avsList, setAvsList] = useState(initialData || []);
  const [nextUri, setNextUri] = useState(initialNextUri || '');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = async () => {
    setLoading(true);
    try {
      const { combinedData, nextUri: newNextUri } = await GetCombinedAVSData(8, 0, 'num_operators desc', nextUri);
      setAvsList([...avsList, ...combinedData]);
      if (newNextUri) {
        setNextUri(newNextUri);
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
    <Layout>  {/* Wrap the content with Layout */}
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
                      <td>
                        <Image src={avs.logo} alt={`${avs.avs_name} logo`} width={50} height={50} />
                      </td>
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
    </Layout>
  );
};

export async function getStaticProps() {
  try {
    const { combinedData, nextUri } = await GetCombinedAVSData(8, 0, 'num_operators desc');
    return { props: { initialData: combinedData, initialNextUri: nextUri || '' } };
  } catch (error) {
    console.error('Error fetching AVS data:', error);
    return { props: { initialData: [], initialNextUri: '' } };
  }
}

export default HomePage;
