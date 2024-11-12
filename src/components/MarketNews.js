import React, { useEffect, useState } from 'react';
import styled from 'styled-components';




const NewsWrapper = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: ${(props) => (props.darkMode ? '#2c3e50' : '#ffffff')};
  border-radius: 8px;
  box-shadow: ${(props) => (props.darkMode ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)')};
`;

const NewsTitle = styled.h2`
  font-size: 1.8rem;
  color: ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
  margin-bottom: 1rem;
`;

const NewsCard = styled.div`
  display: flex;
  align-items: flex-start;
  background: ${(props) => (props.darkMode ? '#34495e' : '#f9f9f9')};
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: ${(props) => (props.darkMode ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)')};
`;

const NewsImage = styled.img`
  width: 120px;
  height: 100%;
  object-fit: cover;
`;

const NewsContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const NewsHeading = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  color: ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
`;

const NewsDescription = styled.p`
  font-size: 0.9rem;
  color: ${(props) => (props.darkMode ? '#bdc3c7' : '#7f8c8d')};
  margin: 0.5rem 0 1rem;
`;

const NewsLink = styled.a`
  color: ${(props) => (props.darkMode ? '#1abc9c' : '#2980b9')};
  text-decoration: none;
  font-weight: bold;
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
            <NewsTitle darkMode={darkMode}>Market News</NewsTitle>
            {news.map((article, index) => (
                <NewsCard key={index} darkMode={darkMode}>
                    <NewsImage src={article.urlToImage || 'https://via.placeholder.com/120'} alt="News Thumbnail" />
                    <NewsContent>
                        <NewsHeading darkMode={darkMode}>{article.title}</NewsHeading>
                        <NewsDescription darkMode={darkMode}>{article.description}</NewsDescription>
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
