import {css} from '@emotion/core'
import React from 'react'
import theme from '../../config/theme'
import Link from '../components/link'
import Signature from '../images/signature.png'
import {bpMaxSM} from '../lib/breakpoints'
import Container from './container'
import {GitHub, Twitter, YouTube} from './social'

const Footer = () => (
  <footer
    css={css`
      background: ${theme.colors.purple_dark};
      color: white;
      margin-top: 70px;
    `}
  >
    <Container
      css={css`
        padding-top: 0;
        padding-bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        ${bpMaxSM} {
          padding-top: 0;
          flex-direction: column;
        }
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          div,
          img {
            margin: 50px 0;
            ${bpMaxSM} {
              margin: 20px 0;
            }
          }
          ${bpMaxSM} {
            align-items: center;
          }
        `}
      >
        <div>
          <Twitter />
          <GitHub />
          <YouTube />
        </div>

        <Link to="/" aria-label="Return to homepage">
          <img
            src={Signature}
            alt="Kent C. Dodds"
            css={css`
              max-width: 100px;
            `}
          />
        </Link>
      </div>
    </Container>
  </footer>
)

export default Footer
