import React, { ReactNode } from 'react'

//import { Helmet } from 'react-helmet'
import { Container, Grid, Header, Icon, Message, SemanticICONS, Placeholder } from 'semantic-ui-react'

type SimplePageProps = React.PropsWithChildren<{
  title: string
  icon?: SemanticICONS
  centered?: boolean
  loading?: boolean
  error?: string
}>

const SimplePage = ({ title, icon, centered, loading, error, children }: SimplePageProps): JSX.Element => (
  <Container style={{ paddingTop: '7em' }}>
  </Container>
);

export default SimplePage;
