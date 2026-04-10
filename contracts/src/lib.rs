#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, Map, String, Vec,
};

/// Property status
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PropertyStatus {
    ForSale,
    Sold,
    Delisted,
}

/// Property data stored on-chain
#[contracttype]
#[derive(Clone, Debug)]
pub struct Property {
    pub id: u64,
    pub owner: Address,
    pub price: i128, // in stroops (1 XLM = 10_000_000 stroops)
    pub metadata: String, // JSON string or IPFS CID
    pub status: PropertyStatus,
    pub created_at: u64,
}

/// Storage keys
#[contracttype]
pub enum DataKey {
    Property(u64),
    PropertyCount,
    AllPropertyIds,
}

// -----------------------------------------------
// DESTATE Smart Contract
// -----------------------------------------------
// Functions:
//   - register_property(owner, price, metadata) -> property_id
//   - buy_property(property_id, buyer)
//   - get_property(property_id) -> Property
//   - list_properties() -> Vec<Property>
//   - get_property_count() -> u64
//   - delist_property(property_id, caller)
//   - update_price(property_id, caller, new_price)
// -----------------------------------------------

#[contract]
pub struct DestateContract;

#[contractimpl]
impl DestateContract {
    /// Register a new property listing
    /// Returns the new property ID
    pub fn register_property(
        env: Env,
        owner: Address,
        price: i128,
        metadata: String,
    ) -> u64 {
        // Owner must authorize
        owner.require_auth();

        // Validate inputs
        if price <= 0 {
            panic!("Price must be positive");
        }

        // Get and increment property count
        let count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::PropertyCount)
            .unwrap_or(0u64);
        let new_id = count + 1;

        // Create property
        let property = Property {
            id: new_id,
            owner: owner.clone(),
            price,
            metadata,
            status: PropertyStatus::ForSale,
            created_at: env.ledger().timestamp(),
        };

        // Store property
        env.storage()
            .persistent()
            .set(&DataKey::Property(new_id), &property);

        // Update count
        env.storage()
            .instance()
            .set(&DataKey::PropertyCount, &new_id);

        // Update ID list
        let mut ids: Vec<u64> = env
            .storage()
            .instance()
            .get(&DataKey::AllPropertyIds)
            .unwrap_or(Vec::new(&env));
        ids.push_back(new_id);
        env.storage()
            .instance()
            .set(&DataKey::AllPropertyIds, &ids);

        // Emit event
        env.events().publish(
            (symbol_short!("listed"), owner),
            (new_id, price),
        );

        new_id
    }

    /// Purchase a property
    /// Transfers ownership from current owner to buyer
    /// NOTE: Actual XLM payment happens via Stellar operations
    ///       This records the ownership change on-chain
    pub fn buy_property(
        env: Env,
        property_id: u64,
        buyer: Address,
    ) {
        // Buyer must authorize
        buyer.require_auth();

        // Load property
        let mut property: Property = env
            .storage()
            .persistent()
            .get(&DataKey::Property(property_id))
            .unwrap_or_else(|| panic!("Property not found: {}", property_id));

        // Validate
        if property.status != PropertyStatus::ForSale {
            panic!("Property is not for sale");
        }

        if property.owner == buyer {
            panic!("Cannot buy your own property");
        }

        let seller = property.owner.clone();

        // Update ownership
        property.owner = buyer.clone();
        property.status = PropertyStatus::Sold;

        // Store updated property
        env.storage()
            .persistent()
            .set(&DataKey::Property(property_id), &property);

        // Emit event
        env.events().publish(
            (symbol_short!("sold"), buyer.clone()),
            (property_id, seller, buyer, property.price),
        );
    }

    /// Get a specific property by ID
    pub fn get_property(env: Env, property_id: u64) -> Property {
        env.storage()
            .persistent()
            .get(&DataKey::Property(property_id))
            .unwrap_or_else(|| panic!("Property not found: {}", property_id))
    }

    /// List all properties
    pub fn list_properties(env: Env) -> Vec<Property> {
        let ids: Vec<u64> = env
            .storage()
            .instance()
            .get(&DataKey::AllPropertyIds)
            .unwrap_or(Vec::new(&env));

        let mut properties = Vec::new(&env);
        for id in ids.iter() {
            if let Some(prop) = env
                .storage()
                .persistent()
                .get(&DataKey::Property(id))
            {
                properties.push_back(prop);
            }
        }
        properties
    }

    /// List only for-sale properties
    pub fn list_available(env: Env) -> Vec<Property> {
        let ids: Vec<u64> = env
            .storage()
            .instance()
            .get(&DataKey::AllPropertyIds)
            .unwrap_or(Vec::new(&env));

        let mut properties = Vec::new(&env);
        for id in ids.iter() {
            if let Some(prop) = env
                .storage()
                .persistent()
                .get::<DataKey, Property>(&DataKey::Property(id))
            {
                if prop.status == PropertyStatus::ForSale {
                    properties.push_back(prop);
                }
            }
        }
        properties
    }

    /// Get total property count
    pub fn get_property_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::PropertyCount)
            .unwrap_or(0u64)
    }

    /// Delist a property (only owner can do this)
    pub fn delist_property(env: Env, property_id: u64, caller: Address) {
        caller.require_auth();

        let mut property: Property = env
            .storage()
            .persistent()
            .get(&DataKey::Property(property_id))
            .unwrap_or_else(|| panic!("Property not found"));

        if property.owner != caller {
            panic!("Only the owner can delist this property");
        }

        property.status = PropertyStatus::Delisted;
        env.storage()
            .persistent()
            .set(&DataKey::Property(property_id), &property);

        env.events().publish(
            (symbol_short!("delist"), caller),
            property_id,
        );
    }

    /// Update property price (only owner)
    pub fn update_price(
        env: Env,
        property_id: u64,
        caller: Address,
        new_price: i128,
    ) {
        caller.require_auth();

        if new_price <= 0 {
            panic!("Price must be positive");
        }

        let mut property: Property = env
            .storage()
            .persistent()
            .get(&DataKey::Property(property_id))
            .unwrap_or_else(|| panic!("Property not found"));

        if property.owner != caller {
            panic!("Only the owner can update the price");
        }

        if property.status != PropertyStatus::ForSale {
            panic!("Property is not for sale");
        }

        property.price = new_price;
        env.storage()
            .persistent()
            .set(&DataKey::Property(property_id), &property);

        env.events().publish(
            (symbol_short!("repriced"), caller),
            (property_id, new_price),
        );
    }

    /// Get properties owned by a specific address
    pub fn get_by_owner(env: Env, owner: Address) -> Vec<Property> {
        let ids: Vec<u64> = env
            .storage()
            .instance()
            .get(&DataKey::AllPropertyIds)
            .unwrap_or(Vec::new(&env));

        let mut properties = Vec::new(&env);
        for id in ids.iter() {
            if let Some(prop) = env
                .storage()
                .persistent()
                .get::<DataKey, Property>(&DataKey::Property(id))
            {
                if prop.owner == owner {
                    properties.push_back(prop);
                }
            }
        }
        properties
    }
}

// ----------------------------------------
// TESTS
// ----------------------------------------
#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Ledger, LedgerInfo};
    use soroban_sdk::{vec, Env, String};

    #[test]
    fn test_register_and_get_property() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(DestateContract, ());
        let client = DestateContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let metadata = String::from_str(&env, r#"{"title":"Test Villa","location":"Testnet"}"#);

        let id = client.register_property(&owner, &5000_0000000i128, &metadata);
        assert_eq!(id, 1u64);

        let prop = client.get_property(&1u64);
        assert_eq!(prop.owner, owner);
        assert_eq!(prop.price, 5000_0000000i128);
        assert_eq!(prop.status, PropertyStatus::ForSale);
    }

    #[test]
    fn test_buy_property() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(DestateContract, ());
        let client = DestateContractClient::new(&env, &contract_id);

        let seller = Address::generate(&env);
        let buyer = Address::generate(&env);
        let metadata = String::from_str(&env, r#"{"title":"Test Penthouse"}"#);

        let id = client.register_property(&seller, &1000_0000000i128, &metadata);
        client.buy_property(&id, &buyer);

        let prop = client.get_property(&id);
        assert_eq!(prop.owner, buyer);
        assert_eq!(prop.status, PropertyStatus::Sold);
    }

    #[test]
    fn test_list_properties() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(DestateContract, ());
        let client = DestateContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let meta1 = String::from_str(&env, r#"{"title":"Prop 1"}"#);
        let meta2 = String::from_str(&env, r#"{"title":"Prop 2"}"#);

        client.register_property(&owner, &500_0000000i128, &meta1);
        client.register_property(&owner, &1000_0000000i128, &meta2);

        let props = client.list_properties();
        assert_eq!(props.len(), 2);
        assert_eq!(client.get_property_count(), 2);
    }

    #[test]
    fn test_delist_property() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(DestateContract, ());
        let client = DestateContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let meta = String::from_str(&env, r#"{"title":"Prop"}"#);

        let id = client.register_property(&owner, &100_0000000i128, &meta);
        client.delist_property(&id, &owner);

        let prop = client.get_property(&id);
        assert_eq!(prop.status, PropertyStatus::Delisted);
    }

    #[test]
    fn test_update_price() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(DestateContract, ());
        let client = DestateContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let meta = String::from_str(&env, r#"{"title":"Prop"}"#);

        let id = client.register_property(&owner, &100_0000000i128, &meta);
        client.update_price(&id, &owner, &200_0000000i128);

        let prop = client.get_property(&id);
        assert_eq!(prop.price, 200_0000000i128);
    }
}
