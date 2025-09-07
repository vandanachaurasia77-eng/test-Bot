import { INode } from '../../src/Interface'

class LocationNode implements INode {
  label = 'Location Reply'
  name = 'locationNode'
  type = 'LocationNode'
  category = 'Chat'
  version = 1.0
  inputs = [
    { label: 'Latitude', name: 'lat', type: 'number' },
    { label: 'Longitude', name: 'lng', type: 'number' },
    { label: 'Title', name: 'title', type: 'string', optional: true }
  ]
  outputs = []

  async run(nodeData: any) {
    const lat = nodeData.inputs?.lat
    const lng = nodeData.inputs?.lng
    const title = nodeData.inputs?.title || 'Location'
    const maps = `https://maps.google.com/?q=${lat},${lng}`
    return { ui: { type: 'location', title, lat, lng, url: maps } }
  }
}

module.exports = { nodeClass: LocationNode }
