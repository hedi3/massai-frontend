import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const NewsWrapper = styled.div`
  max-width: 400px;
  max-height: 250px;
  overflow-y: scroll;
  background-color: ${(props) => (props.darkMode ? '#2c3e50' : '#ffffff')};
  border-radius: 8px;
  box-shadow: ${(props) => (props.darkMode ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)')};
  padding: 1rem;
`;

const NewsTitle = styled.h2`
  font-size: 1.2rem;
  color: ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
  margin-bottom: 0.8rem;
`;

const NewsCard = styled.div`
  display: flex;
  align-items: flex-start;
  background: ${(props) => (props.darkMode ? '#34495e' : '#f9f9f9')};
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: ${(props) => (props.darkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)')};
`;

const NewsImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
`;

const NewsContent = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
`;

const NewsHeading = styled.h3`
  font-size: 1rem;
  margin: 0;
  color: ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
`;

const NewsLink = styled.a`
  color: ${(props) => (props.darkMode ? '#1abc9c' : '#2980b9')};
  text-decoration: none;
  font-size: 0.9rem;
  &:hover {
    text-decoration: underline;
  }
`;

const MarketNews = ({ darkMode }) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&category=business&q=finance&apiKey=273152dfd73f4a8f9fda7e3b5f2abbe1`
      );
      const data = await response.json();
      setNews(data.articles);
    };
    fetchNews();
  }, []);

  return (
      <NewsWrapper darkMode={darkMode}>
        <NewsTitle darkMode={darkMode}>Finance News</NewsTitle>
        {news.map((article, index) => (
            <NewsCard key={index} darkMode={darkMode}>
              <NewsImage src={article.urlToImage || 'https://via.placeholder.com/60'} alt="News Thumbnail" />
              <NewsContent>
                <NewsHeading darkMode={darkMode}>{article.title}</NewsHeading>
                <NewsLink href={article.url} target="_blank" rel="noopener noreferrer" darkMode={darkMode}>
                  Read more
                </NewsLink>
              </NewsContent>
            </NewsCard>
        ))}
      </NewsWrapper>
  );
};

export default MarketNews;
