import React from "react";
import {
  Container,
  Table,
  Pagination,
  Dropdown,
  Dimmer,
  Loader,
  Popup,
} from "semantic-ui-react";
import { useEffect, useState } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { IdentityInfo } from "@polkadot/types/interfaces";
import { formatBalance } from "@polkadot/util";

type Validator = {
  validator: string;
  stashId: string;
  commission: string;
  slashEvents: number;
  totalBonded: string;
  displayName?: string;
};

const ValidatorDashboard = () => {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [loading, setLoading] = useState(true);

  const itemsPerPageOptions = [
    { key: 1, text: "15", value: 15 },
    { key: 2, text: "25", value: 25 },
    { key: 3, text: "50", value: 50 },
    { key: 4, text: "100", value: 100 },
  ];

  const truncateAddress = (address: string, length: number = 10) => {
    return `${address.slice(0, length)}...${address.slice(-length)}`;
  };

  const handlePaginationChange = (e, { activePage }) => {
    setActivePage(activePage);
  };

  const handleItemsPerPageChange = (e, { value }) => {
    setItemsPerPage(value);
    setActivePage(1); // Reset to the first page
  };

  const totalPages = Math.ceil(validators.length / itemsPerPage);

  useEffect(() => {
    const fetchValidators = async () => {
      setLoading(true);
      const provider = new WsProvider("wss://rpc.polkadot.io");
      const api = await ApiPromise.create({ provider });

      const validatorKeys = await api.query.session.validators();
      const validatorStashKeys = await api.query.staking.bonded.multi(
        validatorKeys
      );
      const identityInfos =
        await api.query.identity.identityOf.multi<IdentityInfo>(
          validatorStashKeys
            .map((stash) => stash.unwrapOr(null))
            .filter((stash) => stash)
        );

      const decimals = await api.registry.chainDecimals;

      const validatorInfo = await Promise.all(
        validatorKeys.map(async (validator, index) => {
          const stashId =
            validatorStashKeys[index].unwrapOr(null)?.toString() ?? "";
          const { commission } = await api.query.staking.validators(validator);
          const slashEvents =
            (await api.query.staking.slashingSpans(validator)).unwrapOr(null)
              ?.prior.length ?? 0;
          const totalBondedPlanck = (await api.query.staking.ledger(validator))
            .unwrapOr(null)
            ?.active.toBn();

          const totalBondedDot = totalBondedPlanck
            ? formatBalance(totalBondedPlanck, {
                forceUnit: "-",
                decimals: decimals[0],
              })
            : "0";

          let displayName = "";
          const identityInfo = identityInfos[index]?.unwrapOr(null);
          if (identityInfo && identityInfo.info.display) {
            displayName = identityInfo.info.display.toHuman().Raw;
          }

          return {
            validator: validator.toString(),
            stashId,
            commission: commission.toHuman(),
            slashEvents,
            totalBonded: `${totalBondedDot.split(" ")[0]} DOT`,
            displayName,
          };
        })
      );

      setValidators(validatorInfo);
      setLoading(false);
    };

    fetchValidators();
  }, []);

  return (
    <Container>
      <Dimmer active={loading} inverted>
        <Loader size="large">Loading</Loader>
      </Dimmer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1em",
        }}
      >
        <Dropdown
          selection
          options={itemsPerPageOptions}
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        />
        <Pagination
          activePage={activePage}
          onPageChange={handlePaginationChange}
          totalPages={totalPages}
          siblingRange={1}
        />
      </div>
      <Table celled structured compact unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Validator Address</Table.HeaderCell>
            <Table.HeaderCell>Commission</Table.HeaderCell>
            <Table.HeaderCell>Slash Events</Table.HeaderCell>
            <Table.HeaderCell>Total Bonded</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {validators
            .slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage)
            .map((validator, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  {validator.displayName ? (
                    <>
                      <Popup
                        content={validator.validator}
                        trigger={
                          <span>
                            {validator.displayName}
                            <br />
                            <small>
                              {truncateAddress(validator.validator)}
                            </small>
                          </span>
                        }
                      />
                    </>
                  ) : (
                    <Popup
                      content={validator.validator}
                      trigger={
                        <span>{truncateAddress(validator.validator)}</span>
                      }
                    />
                  )}
                </Table.Cell>
                <Table.Cell>{validator.commission}</Table.Cell>
                <Table.Cell>{validator.slashEvents}</Table.Cell>
                <Table.Cell>{validator.totalBonded}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </Container>
  );
};

export default ValidatorDashboard;
