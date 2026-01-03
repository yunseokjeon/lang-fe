# GitHub Secrets 설정

| Secret Name        | 값                          |
|--------------------|-----------------------------|
| DOCKERHUB_USERNAME | Docker Hub 사용자명         |
| DOCKERHUB_TOKEN    | Docker Hub Access Token     |
| EC2_HOST           | EC2 퍼블릭 IP               |
| EC2_USER           | ec2-user                    |
| EC2_SSH_KEY        | EC2 프라이빗 키 (.pem 내용) |

# Docker Hub Access Token 발급

1. https://hub.docker.com → Account Settings → Security
2. New Access Token → 이름 입력 → Generate
3. 생성된 토큰을 DOCKERHUB_TOKEN에 저장

# EC2에 Docker 설치

```
1. EC2에 SSH 접속

  # .pem 파일 권한 설정 (최초 1회)
  chmod 400 ~/your-key.pem

  # SSH 접속
  ssh -i ~/your-key.pem ec2-user@<EC2-퍼블릭-IP>
  
  예시:
  ssh -i ~/Downloads/my-key.pem ec2-user@13.125.xxx.xxx
  
  EC2 > 인스턴스 > Instance ID > 인스턴스에 연결 > SSH 클라이언트

  2. Docker 설치 (Amazon Linux 2023)

  EC2에 접속한 후:

  # 패키지 업데이트
  sudo dnf update -y

  # Docker 설치
  sudo dnf install -y docker

  # Docker 서비스 시작 및 자동 시작 설정
  sudo systemctl start docker
  sudo systemctl enable docker

  # ec2-user가 docker 명령어 사용할 수 있게 권한 추가
  sudo usermod -aG docker ec2-user

  # 권한 적용을 위해 재접속
  exit

  재접속 후 확인:
  ssh -i ~/your-key.pem ec2-user@<EC2-퍼블릭-IP>

  # Docker 정상 작동 확인
  docker --version

  ---
  참고: Amazon Linux 2 (구버전)를 사용한다면 dnf 대신 yum을 사용
```

# Docker Hub username

1. https://hub.docker.com 에 로그인
2. 오른쪽 상단 프로필 클릭
3. 표시되는 username 확인