var express = require('express');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();
var app = express();
const githubUsername = 'bestswlkh0310';
const githubToken = process.env.TOKEN;
const repoOwner = 'bestswlkh0310';
const repoName = 'Geek-News-kakaowork-bot';
var axios = require('axios')
var cheerio = require('cheerio')
// GitHub 객체 생성
const octokit = new Octokit({
  auth: githubToken,
});

async function getNews() {
  const result = [];

  for (let i = 1; i <= 50; i++) {
    try {
      const response = await axios.get(`https://news.hada.io/new?page=${i}`);
      const $ = cheerio.load(response.data);

      const topics = $('.topics').eq(0).find('.topic_row');
      if (topics.length === 0) {
        break;
      }

      topics.each((index, element) => {
        const title = $(element).find('.topictitle').eq(0).text();
        const description = $(element).find('.topicdesc').eq(0).find('a').eq(0).text();
        const url = $(element).find('a').eq(1).attr('href');
        const createdAt = $(element).find('.topicinfo').eq(0).text().split(" ")[4];

        result.push({
          id: i,
          title: title,
          description: description,
          url: url,
          createdAt: createdAt
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
  return result;
}
// 10분마다 실행
setInterval(async () => {
  try {
    // 현재 시간을 이용하여 커밋 메시지 생성
    const currentTime = new Date();
    const currentDateTime = `${currentTime.getFullYear()}년${currentTime.getMonth()}월${currentTime.getDate()}일${currentTime.getHours()}시${currentTime.getMinutes()}분${currentTime.getSeconds()}초`;
    const fileName = `data/${currentDateTime}.txt`;
    const commitMessage = `${currentDateTime} 커밋`;

    var news = await getNews();
    console.log(news.length);

    const content = JSON.stringify(news);

    console.log(content)

    // 파일을 생성하거나 업데이트
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: repoOwner,
      repo: repoName,
      path: fileName,
      message: commitMessage,
      content: Buffer.from(content).toString('base64'),
    });

    console.log(`Commit created: ${response.data.commit.message}`);
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}, 3000); // 10분

app.listen(3003, () => {
  console.log('start')
});