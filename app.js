var express = require('express');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();
var app = express();
const githubUsername = 'bestswlkh0310';
const githubToken = process.env.TOKEN
const repoOwner = 'bestswlkh0310';
const repoName = 'Geek-News-kakaowork-bot';
// GitHub 객체 생성
const octokit = new Octokit({
  auth: githubToken,
});

// 10분마다 실행
setInterval(async () => {
  try {
    // 현재 시간을 이용하여 커밋 메시지 생성
    const currentTime = new Date();
    const currentDateTime = `${currentTime.getFullYear()}년${currentTime.getMonth()}월${currentTime.getDate()}일${currentTime.getHours()}시${currentTime.getMinutes()}분.txt`;
    const fileName = `${currentDateTime}.txt`;
    const commitMessage = `${currentDateTime} 커밋`;

    // 파일을 생성하거나 업데이트
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: repoOwner,
      repo: repoName,
      path: fileName,
      message: commitMessage,
      content: Buffer.from(fileName).toString('base64'),
    });

    console.log(`Commit created: ${response.data.commit.message}`);
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}, 3000); // 10분

app.listen(3003, () => {
  console.log('start')
});