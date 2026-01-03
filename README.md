# Audio Player

언어 학습을 위한 A-B 구간 반복 오디오 플레이어입니다.

## 주요 기능

- **A-B 구간 반복**: 마커 A와 B를 설정하여 특정 구간만 반복 재생
- **반복 모드**: x5, x10, 무한(∞) 반복 지원
- **구간 저장**: 5개 슬롯에 마커 위치 저장 및 불러오기
- **재생 속도 조절**: 0.5x ~ 3.0x 배속 조절
- **볼륨 조절**: 드래그로 간편한 볼륨 조절
- **파일 관리**: 최대 2개 오디오 파일 동시 로드 및 전환
- **5초 건너뛰기**: 앞/뒤로 5초씩 빠르게 이동

## 기술 스택

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Icons**: Lucide React

## 시작하기

```bash
cd audio-player
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)에 접속합니다.

## 프로젝트 구조

```
audio-player/
├── app/
│   ├── components/
│   │   ├── ControlGrid.tsx      # 볼륨, 속도, 반복 모드 컨트롤
│   │   ├── Header.tsx           # 파일 업로드 및 선택
│   │   ├── NumberButtons.tsx    # 구간 저장 슬롯 (1-5)
│   │   ├── PlaybackControls.tsx # 재생, 일시정지, 건너뛰기
│   │   ├── ProgressBar.tsx      # 재생 위치 및 마커 표시
│   │   ├── SplashScreen.tsx     # 스플래시 화면
│   │   ├── TimeDisplay.tsx      # 현재 시간 표시
│   │   └── TipsDisplay.tsx      # 사용 팁 표시
│   ├── hooks/
│   │   └── useDrag.ts           # 드래그 관련 커스텀 훅
│   ├── utils/
│   │   └── time.ts              # 시간 유틸리티
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── package.json
└── tailwind.config.ts
```

## 사용 방법

1. **파일 업로드**: 상단의 업로드 버튼으로 오디오 파일 선택
2. **구간 설정**: 프로그레스 바에서 A, B 마커를 드래그하거나 A/B 버튼 클릭
3. **반복 재생**: x5, x10, ∞ 버튼으로 반복 모드 선택
4. **구간 저장**: 1-5 번호 버튼으로 현재 구간 저장/불러오기
5. **전체 선택**: ALL 버튼으로 전체 구간 선택

## 배포

### 배포 아키텍처

```
GitHub (main branch)
    │
    ▼ push
GitHub Actions
    │
    ├─▶ Docker 이미지 빌드
    │
    ▼
Docker Hub
    │
    ▼ pull
AWS EC2
    │
    ▼
http://<EC2-IP>:80
```

### 자동 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 배포를 수행합니다.

수동으로 배포하려면:
1. GitHub → Actions → "Deploy to EC2"
2. "Run workflow" 버튼 클릭

### GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions에서 다음 값들을 설정해야 합니다:

| Secret Name | 설명 | 예시 |
|-------------|------|------|
| `DOCKERHUB_USERNAME` | Docker Hub 사용자명 | `username` |
| `DOCKERHUB_TOKEN` | Docker Hub Access Token | Docker Hub에서 발급 |
| `EC2_HOST` | EC2 퍼블릭 IP 또는 DNS | `13.49.233.52` |
| `EC2_USER` | EC2 SSH 사용자명 | `ec2-user` |
| `EC2_SSH_KEY` | EC2 SSH 프라이빗 키 (.pem 파일 내용 전체) | `-----BEGIN RSA...` |

### EC2 인스턴스 설정

#### 1. Docker 설치 (Amazon Linux 2023)

```bash
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user
exit  # 재접속 필요
```

#### 2. 보안 그룹 인바운드 규칙

| 유형 | 포트 | 소스 |
|-----|-----|-----|
| SSH | 22 | 0.0.0.0/0 (또는 특정 IP) |
| HTTP | 80 | 0.0.0.0/0 |

### 로컬에서 Docker 테스트

```bash
cd audio-player
docker build -t audio-player .
docker run -p 3000:3000 audio-player
```

브라우저에서 http://localhost:3000 접속

### 배포 관련 파일

| 파일 | 설명 |
|-----|------|
| `audio-player/Dockerfile` | Docker 이미지 빌드 설정 |
| `audio-player/.dockerignore` | Docker 빌드 시 제외할 파일 |
| `.github/workflows/deploy.yml` | GitHub Actions 워크플로우 |
